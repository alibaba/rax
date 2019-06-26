const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const createJSX = require('../utils/createJSX');
const createBinding = require('../utils/createBinding');
const genExpression = require('../codegen/genExpression');

const TEMPLATE_AST = 'templateAST';
const RENDER_FN_PATH = 'renderFunctionPath';

function transformRenderFunction(ast, adapter) {
  const templateVariables = {};
  traverse(ast, {
    VariableDeclaration: {
      enter(nodePath) {
        const { node } = nodePath;
        const { declarations } = node;
        declarations.map((declaration) => {
          const { id, init } = declaration;

          switch (id.type) {
            case 'Identifier':
              const value = init ? init.value : null;
              templateVariables[id.name] = { value };
              break;

            case 'ObjectPattern':
              if (Array.isArray(id.properties)) {
                id.properties.forEach(objProperty => {
                  templateVariables[objProperty.value.name] = {
                    source: t.isMemberExpression(init) ? init.property.name : init.name,
                  };
                });
              }
              break;

            case 'ArrayPattern':
              if (Array.isArray(id.elememts)) {
                id.elememts.forEach((el, index) => {
                  if (t.isIdentifier(el)) {
                    templateVariables[el.name] = init.elememts[index].value;
                  }
                });
              }
              break;
          }
        });
      }
    },
    IfStatement: {
      enter(nodePath) {
        const { node } = nodePath;
        const { consequent, alternate, test, start, end } = node;
        const testValue = genExpression(test);
        // parse consequent
        consequent.body.map(({ expression }) => {
          if (t.isAssignmentExpression(expression) && expression.operator === '=') {
            const varName = expression.left.name;
            if (!templateVariables[varName].value) {
              templateVariables[expression.left.name].value = createJSX('block');
            }
            /**
             * Todo:
             * 1. value tranmits
             */
            let testAttrName = adapter.if;
            const parentPathAlternate = nodePath.parent.alternate;
            /**
             * Condition:
             * 1. parentPath is IfStatement
             * 2. parentNode's alternate start & end is same as current path start & end
             */
            if (t.isIfStatement(nodePath.parentPath)
              && t.isIfStatement(parentPathAlternate)
              && parentPathAlternate.start === start
              && parentPathAlternate.end === end) {
              testAttrName = adapter.elseif;
            }
            const rightNode = expression.right;
            const containerNode = rightNode && !t.isNullLiteral(rightNode)
              ? createJSX('block', {
                [testAttrName]: t.stringLiteral('{{' + testValue + '}}'),
              }, [rightNode])
              : null;

            templateVariables[varName].value.children.push(containerNode);
          }
        });
        if (!t.isIfStatement(alternate)) {
          alternate.body.map(({expression}) => {
            if (t.isAssignmentExpression(expression) && expression.operator === '=') {
              const varName = expression.left.name;
              const rightNode = expression.right;
              if (rightNode) {
                const containerNode = createJSX('block', {
                  [adapter.else]: t.stringLiteral('{{true}}'),
                }, [rightNode]);

                if (templateVariables[varName].value) {
                  templateVariables[varName].value.children.push(containerNode);
                } else {
                  templateVariables[varName].value = containerNode;
                }
              }
            }
          });
        }
      }
    },
  });
  return templateVariables;
}

function transformTemplate(ast, adapter, templateVariables) {
  traverse(ast, {
    JSXExpressionContainer(path) {
      const { node, parentPath } = path;
      if (parentPath.isJSXAttribute()) {
        path.skip();
        return;
      }

      switch (node.expression.type) {
        case 'ConditionalExpression': {
          let { test, consequent, alternate } = node.expression;
          const conditionValue = t.isStringLiteral(test) ? test.value : createBinding(genExpression(test));
          const replacement = [];

          // Transform from string listrial to JSXText Node
          if (t.isStringLiteral(consequent)) {
            consequent = t.jsxText(consequent.value);
          }
          if (t.isStringLiteral(alternate)) {
            alternate = t.jsxText(alternate.value);
          }

          // Transform from `'s' + str` to `{{ 's' + str }}`
          if (t.isBinaryExpression(consequent)) {
            consequent = t.jsxExpressionContainer(consequent);
          }
          if (t.isBinaryExpression(alternate)) {
            alternate = t.jsxExpressionContainer(alternate);
          }

          // Empty value to replace null literial.
          if (t.isNullLiteral(consequent)) consequent = t.jsxText('');
          if (t.isNullLiteral(alternate)) alternate = t.jsxText('');

          replacement.push(createJSX('block', {
            [adapter.if]: t.stringLiteral(conditionValue),
          }, [consequent]));

          replacement.push(createJSX('block', {
            [adapter.else]: null,
          }, [alternate]));

          path.replaceWithMultiple(replacement);
          break;
        }

        // { foo }
        case 'Identifier': {
          const id = node.expression.name.trim();
          if (templateVariables[id] && t.isJSXElement(templateVariables[id].value)) {
            // => <block a:if="xxx">
            path.replaceWith(templateVariables[id].value);
          }

          break;
        }
      }
    },
  });
}

module.exports = {
  parse(parsed, code, options) {
    const templateVariables = transformRenderFunction(parsed[RENDER_FN_PATH], options.adapter);
    transformTemplate(parsed[TEMPLATE_AST], options.adapter, templateVariables);
  },

  // For test cases.
  _transformRenderFunction: transformRenderFunction,
  _transformTemplate: transformTemplate,
};

