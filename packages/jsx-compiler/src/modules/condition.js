const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const createJSX = require('../utils/createJSX');
const createJSXBinding = require('../utils/createJSXBinding');
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
          const { test, consequent, alternate } = node.expression;
          const conditionValue = genExpression(test);
          const replacement = [];

          replacement.push(createJSX('block', {
            [adapter.if]: t.stringLiteral('{{' + conditionValue + '}}'),
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
          } else {
            // => {{ foo }}
            path.replaceWith(createJSXBinding(id));
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

