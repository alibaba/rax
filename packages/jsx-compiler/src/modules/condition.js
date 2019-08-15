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
            let shouldRemove = false;
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
              shouldRemove = true;
            }

            if (shouldRemove) {
              nodePath.remove();
            }
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

function transformTemplate(ast, adapter, templateVariables) {
  const dynamicValue = {};

  traverse(ast, {
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
  let { test, consequent, alternate } = expression;

  let conditionValue;
  if (/Expression$/.test(test.type)) {
    conditionValue = t.jsxExpressionContainer(test);
  } else if (t.isStringLiteral(test)) {
    conditionValue = test;
  } else {
    // Other literal types or identifier.
    conditionValue = t.stringLiteral(createBinding(genExpression(test)));
    if (t.isIdentifier(test)) dynamicValue[test.name] = test;
  }
  const replacement = [];
  let consequentReplacement = [];
  let alternateReplacement = [];

  if (t.isExpression(consequent)) {
    if (t.isConditionalExpression(consequent)) {
      consequentReplacement = transformConditionalExpression(
        path,
        consequent,
        adapter,
        dynamicValue
      ).replacement;
    } else if (/Literal$/.test(consequent.type)) {
      // Transform from literal type to JSXText Node
      const value = consequent.value ? String(consequent.value) : '';
      consequentReplacement.push(t.jsxText(value));
    } else if (t.isJSXElement(consequent)) {
      consequentReplacement.push(consequent);
    } else {
      consequentReplacement.push(t.jsxExpressionContainer(consequent));
    }
  }

  if (t.isExpression(alternate)) {
    if (t.isConditionalExpression(alternate)) {
      alternateReplacement = transformConditionalExpression(
        path,
        alternate,
        adapter,
        dynamicValue
      ).replacement;
    } else if (t.isNullLiteral(alternate)) {
      // Ignore null
    } else if (/Literal$/.test(alternate.type)) {
      alternateReplacement.push(t.jsxText(String(alternate.value)));
    } else if (t.isJSXElement(alternate)) {
      alternateReplacement.push(alternate);
    } else {
      alternateReplacement.push(t.jsxExpressionContainer(alternate));
    }
  }

  if (consequentReplacement.length > 0) {
    replacement.push(
      createJSX(
        'block',
        {
          [adapter.if]: conditionValue,
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
      parsed[TEMPLATE_AST] = templateVariables[parsed[TEMPLATE_AST].name].value;
    } else {
      const dynamicValue = transformTemplate(parsed[TEMPLATE_AST], options.adapter, templateVariables);
      Object.assign(parsed.dynamicValue = parsed.dynamicValue || {}, dynamicValue);
    }
  },

  // For test cases.
  _transformRenderFunction: transformRenderFunction,
  _transformTemplate: transformTemplate,
};
