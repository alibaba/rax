const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const createJSX = require('../utils/createJSX');
const createBinding = require('../utils/createBinding');
const genExpression = require('../codegen/genExpression');
const CodeError = require('../utils/CodeError');
const chalk = require('chalk');

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

function transformTemplate(ast, adapter, templateVariables, code) {
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
          const { replacement } = transformConditionalExpression(path, node.expression, { adapter, dynamicValue, code });
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
    LogicalExpression(path) {
      if (path.parentPath.isJSXExpressionContainer()) {
        const { right, left, operator } = path.node;
        let replacement = [];
        if (isJSX(left)) {
          if (operator === '&&') {
            replacement.push(right);
          } else if (operator === '||') {
            replacement.push(left);
          } else {
            throw new CodeError(code, path.node, path.node.loc, 'Logical operator only support && or ||');
          }
        } else {
          let test;
          if (operator === '||') {
            test = t.unaryExpression('!', left);
          } else if (operator === '&&') {
            test = left;
          } else {
            throw new CodeError(code, path.node, path.node.loc, 'Logical operator only support && or ||');
          }
          const children = [];
          if (/Expression$/.test(right.type)) {
            children.push(t.jsxExpressionContainer(right));
          } else {
            children.push(right);
          }
          replacement.push(createJSX('block', {
            [adapter.if]: generateConditionValue(test, {adapter, dynamicValue})
          }, children));
          replacement.push(createJSX('block', {
            [adapter.else]: null,
          }, [t.jsxExpressionContainer(left)]));
          if (/Expression$/.test(left.type)) {
            console.log(chalk.yellow("When logicalExpression's left node is an expression, there may not have JSX"));
          }
        }
        path.parentPath.replaceWithMultiple(replacement);
      } else {
        path.skip();
      }
    }
  });

  return dynamicValue;
}

/**
 * @param {Object} path
 *        jsxExpressionContainer
 * @param {Object} expression
 *        Condition Expression
 * @param {{ adapter: Object, dynamicValue: Object, code: String }} options
 * @returns {{ replacement: Object, dynamicValue: Object }}
 * */
function transformConditionalExpression(path, expression, options) {
  let { test, consequent, alternate } = expression;

  const replacement = [];
  let consequentReplacement = [];
  let alternateReplacement = [];

  if (t.isExpression(consequent)) {
    if (t.isConditionalExpression(consequent)) {
      consequentReplacement = transformConditionalExpression(
        path,
        consequent,
        options
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
        options
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
          [options.adapter.if]: generateConditionValue(test, options),
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
          [options.adapter.else]: null,
        },
        alternateReplacement,
      ),
    );
  }
  return { replacement, dynamicValue: options.dynamicValue };
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
      const dynamicValue = transformTemplate(parsed[TEMPLATE_AST], options.adapter, templateVariables, code);
      Object.assign(parsed.dynamicValue = parsed.dynamicValue || {}, dynamicValue);
    }
  },

  // For test cases.
  _transformRenderFunction: transformRenderFunction,
  _transformTemplate: transformTemplate,
};

function generateConditionValue(test, options) {
  let conditionValue;
  if (/Expression$/.test(test.type)) {
    conditionValue = t.jsxExpressionContainer(test);
  } else if (t.isStringLiteral(test)) {
    conditionValue = test;
  } else {
    // Other literal types or identifier.
    conditionValue = t.stringLiteral(createBinding(genExpression(test)));
    if (t.isIdentifier(test)) options.dynamicValue[test.name] = test;
  }
  return conditionValue;
}

function isJSX(node) {
  return ['JSXElement', 'JSXText', 'JSXFragment'].indexOf(node.type) > -1;
}
