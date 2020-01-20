const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const createJSX = require('../utils/createJSX');
const createBinding = require('../utils/createBinding');
const CodeError = require('../utils/CodeError');
const chalk = require('chalk');

const TEMPLATE_AST = 'templateAST';
const RENDER_FN_PATH = 'renderFunctionPath';

function transformRenderFunction(ast, adapter) {
  // Identifier name & jsx map
  const templateMap = {};
  traverse(ast, {
    IfStatement: {
      enter(path) {
        const consequentPath = path.get('consequent');
        const alternatePath = path.get('alternate');
        const consequentBodyPath = consequentPath.get('body');
        // parse consequent
        if (consequentBodyPath.length > 0) {
          consequentBodyPath.map((statementPath) => {
            handleConsequent(
              path,
              statementPath.get('expression'),
              templateMap,
              adapter
            );
          });
        } else {
          if (consequentPath.isExpressionStatement()) {
            handleConsequent(
              path,
              consequentPath.get('expression'),
              templateMap,
              adapter
            );
          } else {
            handleConsequent(path, consequentPath, templateMap, adapter);
          }
        }

        if (!alternatePath.isIfStatement() && alternatePath.node) {
          const alternateBodyPath = alternatePath.get('body');
          if (alternateBodyPath) {
            alternateBodyPath.map((statementPath) => {
              handleAlternate(
                statementPath.get('expression'),
                templateMap,
                adapter
              );
            });
          } else {
            if (alternatePath.isExpressionStatement()) {
              handleConsequent(
                path,
                alternatePath.get('expression'),
                templateMap,
                adapter
              );
            } else {
              handleConsequent(path, alternatePath, templateMap, adapter);
            }
          }
        }
      },
    },
  });
  return templateMap;
}

function transformTemplate(ast, templateMap, adapter, code) {
  traverse(ast, {
    JSXExpressionContainer(path) {
      const { node, parentPath } = path;
      if (parentPath.isJSXAttribute()) {
        path.skip();
        return;
      }

      if (node.expression.type === 'ConditionalExpression') {
        const { replacement } = transformConditionalExpression(path, node.expression, { adapter, code });
        path.replaceWithMultiple(replacement);
      }

      path.traverse({
        Identifier(innerPath) {
          const template = templateMap[innerPath.node.name];
          if (template) {
            path.replaceWith(template);
          }
        }
      });
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
          if (isJSX(right)) {
            children.push(right);
          } else {
            children.push(t.jsxExpressionContainer(right));
          }
          replacement.push(createJSX('block', {
            [adapter.if]: generateConditionValue(test, { adapter })
          }, children));
          if (!/Expression$/.test(left.type)) {
            replacement.push(createJSX('block', {
              [adapter.else]: null,
            }, [t.jsxExpressionContainer(left)]));
          } else {
            console.log(chalk.yellow("When logicalExpression's left node is an expression, please write JSX directly instead of using a variable which is assigned a JSX element."
            ));
          }
        }
        path.parentPath.replaceWithMultiple(replacement);
      } else {
        path.skip();
      }
    }
  });
}

/**
 * @param {Object} path
 *        jsxExpressionContainer
 * @param {Object} expression
 *        Condition Expression
 * @param {{ adapter: Object, code: String }} options
 * @returns {{ replacement: Object }}
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
  return { replacement };
}

module.exports = {
  parse(parsed, code, options) {
    const templateMap = transformRenderFunction(
      parsed[RENDER_FN_PATH],
      options.adapter,
    );
    transformTemplate(parsed[TEMPLATE_AST], templateMap, options.adapter, code);
  },

  // For test cases.
  _transformRenderFunction: transformRenderFunction,
  _transformTemplate: transformTemplate,
};

function generateConditionValue(test, options) {
  let conditionValue;
  if (t.isStringLiteral(test)) {
    conditionValue = test;
  } else {
    // Other types.
    conditionValue = t.jsxExpressionContainer(test);
  }
  return conditionValue;
}

function isJSX(node) {
  return ['JSXElement', 'JSXText', 'JSXFragment'].indexOf(node.type) > -1;
}

/**
 * @param path IfStatement
 * @param expressionPath consequent expression path
 * @param templateMap variable => jsx template
 * @param adapter
 * */
function handleConsequent(path, expressionPath, templateMap, adapter) {
  const { node } = path;
  const { test, start, end } = node;
  const expression = expressionPath.node;
  if (
    t.isAssignmentExpression(expression) &&
    expression.operator === '=' &&
    t.isIdentifier(expression.left)
  ) {
    const rightPath = expressionPath.get('right');
    const varName = expression.left.name;
    if (!templateMap[varName]) {
      templateMap[varName] = createJSX('block');
    }
    let testAttrName = adapter.if;
    const parentPathAlternate = path.parent.alternate;
    /**
     * Condition:
     * 1. parentPath is IfStatement
     * 2. parentNode's alternate start & end is same as current path start & end
     */
    if (
      path.parentPath.isIfStatement() &&
        t.isIfStatement(parentPathAlternate) &&
        parentPathAlternate.start === start &&
        parentPathAlternate.end === end
    ) {
      testAttrName = adapter.elseif;
    }
    const rightNode = rightPath.node;
    const containerNode = createJSX(
      'block',
      {
        [testAttrName]: t.jsxExpressionContainer(Object.assign({}, test)),
      },
      [isJSX(rightNode) ? rightNode : t.jsxExpressionContainer(rightNode)],
    );

    templateMap[varName].children.push(containerNode);
    if (hasJSX(rightPath)) {
      // Remove only if the expression contains JSX
      expressionPath.remove();
    }
  }
}

/**
 * @param expressionPath alternate expression path
 * @param templateMap variable => jsx template
 * @param adapter
 * */
function handleAlternate(expressionPath, templateMap, adapter) {
  const expression = expressionPath.node;
  if (
    t.isAssignmentExpression(expression) &&
    expression.operator === '=' &&
    t.isIdentifier(expression.left)
  ) {
    const varName = expression.left.name;
    const rightPath = expressionPath.get('right');
    const rightNode = rightPath.node;
    if (hasJSX(rightPath)) {
      const containerNode = createJSX(
        'block',
        {
          [adapter.else]: null,
        },
        [rightNode],
      );

      if (templateMap[varName]) {
        templateMap[varName].children.push(containerNode);
      } else {
        templateMap[varName] = containerNode;
      }
      expressionPath.remove();
    }
  }
}

/**
 * @param target path
 * */
function hasJSX(path) {
  let exist = false;
  path.traverse({
    JSXElement() {
      exist = true;
    },
    JSXText() {
      exist = true;
    },
    JSXFragment() {
      exist = true;
    }
  });
  return exist;
}
