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
        declarations.map(declaration => {
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
                    source: t.isMemberExpression(init)
                      ? init.property.name
                      : init.name,
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
      },
    },
    IfStatement: {
      enter(nodePath) {
        const { node } = nodePath;
        const { consequent, alternate, test, start, end } = node;
        const testValue = genExpression(test);
        // parse consequent
        consequent.body.map(({ expression }) => {
          if (
            t.isAssignmentExpression(expression) &&
            expression.operator === '='
          ) {
            const varName = expression.left.name;
            if (!templateVariables[varName].value) {
              templateVariables[expression.left.name].value = createJSX(
                'block',
              );
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
            if (
              nodePath.parentPath.isIfStatement() &&
              t.isIfStatement(parentPathAlternate) &&
              parentPathAlternate.start === start &&
              parentPathAlternate.end === end
            ) {
              testAttrName = adapter.elseif;
            }
            const rightNode = expression.right;
            if (t.isJSXElement(rightNode)) {
              const containerNode = createJSX(
                    'block',
                    {
                      [testAttrName]: t.stringLiteral(
                        '{{' + testValue + '}}',
                      ),
                    },
                    [rightNode],
                  );

              templateVariables[varName].value.children.push(containerNode);
            }
            nodePath.remove();
          }
        });
        if (!t.isIfStatement(alternate) && alternate) {
          alternate.body.map(({ expression }) => {
            if (
              t.isAssignmentExpression(expression) &&
              expression.operator === '='
            ) {
              const varName = expression.left.name;
              const rightNode = expression.right;
              if (t.isJSXElement(rightNode)) {
                const containerNode = createJSX(
                  'block',
                  {
                    [adapter.else]: null,
                  },
                  [rightNode],
                );

                if (templateVariables[varName].value) {
                  templateVariables[varName].value.children.push(containerNode);
                } else {
                  templateVariables[varName].value = containerNode;
                }
              }
            }
          });
        }
      },
    },
  });
  return templateVariables;
}

function assignDynamicValue(root, dynamicValue) {
  traverse(root, {
    MemberExpression(path) {
      dynamicValue[path.node.object.name] = path.node.object;
      path.skip();
    },
    Identifier(path) {
      dynamicValue[path.node.name] = path.node;
    },
  });
}

function transformTemplate(ast, adapter, templateVariables) {
  const dynamicValue = {};

  traverse(ast, {
    CallExpression(path) {
      const { node } = path;
      if (t.isMemberExpression(node.callee) && t.isIdentifier(node.callee.property, { name: 'map' })) {
        node.__isList = true;
      }
    },
    JSXExpressionContainer(path) {
      const { node, parentPath } = path;
      if (parentPath.isJSXAttribute()) {
        path.skip();
        return;
      }

      switch (node.expression.type) {
        case 'ConditionalExpression': {
          const { replacement } = transformConditionalExpression(path, path.node.expression, adapter, dynamicValue);
          path.replaceWithMultiple(replacement);
          break;
        }

        // { foo }
        case 'Identifier': {
          const id = node.expression.name.trim();
          if (
            templateVariables[id] &&
            t.isJSXElement(templateVariables[id].value)
          ) {
            // => <block a:if="xxx">
            path.replaceWith(templateVariables[id].value);
          }

          break;
        }
      }
    },
  });

  return dynamicValue;
}

function transformConditionalExpression(path, expression, adapter, dynamicValue) {
  const listCallExpPath = path.findParent(p => p.isCallExpression() && p.node.__isList);
  let { test, consequent, alternate } = expression;
  const conditionValue = t.isStringLiteral(test)
    ? test.value
    : createBinding(genExpression(test));
  const replacement = [];
  let consequentReplacement = [];
  let alternateReplacement = [];

  if (t.isConditionalExpression(consequent)) {
    consequentReplacement = transformConditionalExpression(
      path,
      consequent,
      adapter,
      dynamicValue
    ).replacement;
  }
  if (t.isConditionalExpression(alternate)) {
    alternateReplacement = transformConditionalExpression(
      path,
      alternate,
      adapter,
      dynamicValue
    ).replacement;
  }
  // Transform from string listrial to JSXText Node
  if (t.isStringLiteral(consequent)) {
    consequentReplacement.push(t.jsxText(consequent.value));
  }
  if (t.isStringLiteral(alternate)) {
    alternateReplacement.push(t.jsxText(alternate.value));
  }

  // Transform from `'s' + str` to `{{ 's' + str }}`
  if (t.isBinaryExpression(consequent)) {
    consequentReplacement.push(t.jsxExpressionContainer(consequent));
  }
  if (t.isBinaryExpression(alternate)) {
    alternateReplacement.push(t.jsxExpressionContainer(alternate));
  }

  // Empty value to replace null literial.
  if (t.isNullLiteral(consequent)) consequentReplacement.push(t.jsxText(''));
  if (t.isNullLiteral(alternate)) alternateReplacement.push(alternate = t.jsxText(''));

  if (t.isJSXElement(consequent)) consequentReplacement.push(consequent);
  if (t.isJSXElement(alternate)) alternateReplacement.push(alternate);

  if (consequentReplacement.length > 0) {
    if (!listCallExpPath) {
      assignDynamicValue(test, dynamicValue);
    }
    replacement.push(
      createJSX(
        'block',
        {
          [adapter.if]: t.stringLiteral(conditionValue),
        },
        consequentReplacement,
      ),
    );
  }
  if (alternateReplacement.length > 0) {
    replacement.push(
      createJSX(
        'block',
        {
          [adapter.else]: null,
        },
        alternateReplacement,
      ),
    );
  }
  return { replacement, dynamicValue };
}

module.exports = {
  parse(parsed, code, options) {
    const templateVariables = transformRenderFunction(
      parsed[RENDER_FN_PATH],
      options.adapter,
    );
    if (t.isIdentifier(parsed[TEMPLATE_AST]) && parsed[TEMPLATE_AST].name in templateVariables) {
      parsed[TEMPLATE_AST] = templateVariables[parsed[TEMPLATE_AST].name];
    } else {
      const dynamicValue = transformTemplate(parsed[TEMPLATE_AST], options.adapter, templateVariables);
      Object.assign(parsed.dynamicValue = parsed.dynamicValue || {}, dynamicValue);
    }
  },

  // For test cases.
  _transformRenderFunction: transformRenderFunction,
  _transformTemplate: transformTemplate,
};
