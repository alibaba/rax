const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const genExpression = require('../codegen/genExpression');

const directiveIf = 'x-if';
const directiveElseif = 'x-elseif';
const directiveElse = 'x-else';
const miniappDirectives = {
  [directiveIf]: 'a:if',
  [directiveElseif]: 'a:elif',
  [directiveElse]: 'a:else',
};

/**
 * Get condition type, enum of {if|elseif|else|null}
 */
function getCondition(jsxElement) {
  if (t.isJSXOpeningElement(jsxElement.openingElement)) {
    const { attributes } = jsxElement.openingElement;
    for (let i = 0, l = attributes.length; i < l; i++) {
      if (t.isJSXAttribute(attributes[i])) {
        switch (attributes[i].name.name) {
          case directiveIf:
          case directiveElseif:
          case directiveElse:
            return {
              type: attributes[i].name.name,
              value: t.isJSXExpressionContainer(attributes[i].value)
                ? attributes[i].value.expression
                : attributes[i].value,
              index: i,
            };
        }
      }
    }
  }
  return null;
}

function transformDirectiveCondition(ast) {
  const dynamicValue = {};
  traverse(ast, {
    JSXElement(path) {
      const { node, parentPath } = path;
      const condition = getCondition(node);
      if (condition !== null && condition.value !== null && condition.type === directiveIf) {
        const { type, value, index } = condition;
        const conditions = [];

        node.openingElement.attributes.splice(index, 1);
        conditions.push({
          type,
          value,
          jsxElement: node,
        });

        let continueSearch = false;
        let nextJSXElPath = path;
        let nextJSXElCondition;
        do {
          nextJSXElPath = nextJSXElPath.getSibling(nextJSXElPath.key + 1);
          if (nextJSXElPath.isJSXText() && nextJSXElPath.node.value.trim() === '') {
            continueSearch = true;
          } else if (nextJSXElPath.isJSXElement()
            && (nextJSXElCondition = getCondition(nextJSXElPath.node))) {
            conditions.push({
              type: nextJSXElCondition.type,
              value: nextJSXElCondition.value,
              jsxElement: nextJSXElPath.node,
            });
            nextJSXElPath.node.openingElement.attributes.splice(nextJSXElCondition.index, 1);
            continueSearch = true;
          } else {
            continueSearch = false;
          }
        } while (continueSearch);

        conditions.forEach(({ type, value, jsxElement }) => {
          const { attributes } = jsxElement.openingElement;
          const attr = type === directiveElse
            ? t.jsxAttribute(t.jsxIdentifier(miniappDirectives[type]))
            : t.jsxAttribute(
              t.jsxIdentifier(miniappDirectives[type]),
              t.stringLiteral(`{{${genExpression(value)}}}`)
            );
          if (t.isIdentifier(value)) {
            dynamicValue[value.name] = value;
          }
          attributes.push(attr);
        });
      }
    }
  });
  return dynamicValue;
}

function transformDirectiveList(ast) {
  const dynamicValue = {};
  traverse(ast, {
    JSXElement: {
      exit(path) {
        const { node } = path;
        const { attributes } = node.openingElement;
        if (node.__jsxlist) {
          const { args, iterValue } = node.__jsxlist;
          dynamicValue[iterValue.name] = iterValue;
          attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier('a:for'),
              t.stringLiteral(`{{${genExpression(iterValue)}}}`)
            )
          );
          args.forEach((arg, index) => {
            attributes.push(
              t.jsxAttribute(
                t.jsxIdentifier(['a:for-item', 'a:for-index'][index]),
                t.stringLiteral(arg.name)
              )
            );
          });
          node.__jsxlist = null;
        }
      }
    },
    JSXAttribute(path) {
      const { node } = path;
      if (t.isJSXIdentifier(node.name, { name: 'x-for' })) {
        // Check stynax.
        if (!t.isJSXExpressionContainer(node.value)) {
          // TODO: throw err prettier.
          console.warn('ignore x-for due to stynax error.');
          return;
        }
        const { expression } = node.value;
        let params = [];
        let iterValue;

        if (t.isBinaryExpression(expression, { operator: 'in' })) {
          // x-for={(item, index) in value}
          const { left, right } = expression;
          iterValue = right;
          if (t.isSequenceExpression(left)) {
            // x-for={(item, key) in value}
            params = left.expressions;
          } else if (t.isIdentifier(left)) {
            // x-for={item in value}
            params.push(left);
          } else {
            // x-for={??? in value}
            throw new Error('Stynax error of x-for.');
          }
        } else {
          // x-for={value}, x-for={callExp()}, ...
          iterValue = expression;
        }

        const parentJSXEl = path.findParent(p => p.isJSXElement());
        parentJSXEl.node.__jsxlist = { args: params, iterValue };

        path.remove();
      }
    }
  });
  return dynamicValue;
}

module.exports = {
  parse(parsed, code, options) {
    if (parsed.renderFunctionPath) {
      Object.assign(
        parsed.dynamicValue = parsed.dynamicValue || {},
        transformDirectiveCondition(parsed.renderFunctionPath),
        transformDirectiveList(parsed.renderFunctionPath),
      );
    }
  },
  _transformList: transformDirectiveList,
  _transformCondition: transformDirectiveCondition,
};
