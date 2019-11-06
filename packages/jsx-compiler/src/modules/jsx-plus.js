const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const getListItem = require('../utils/getListItem');
const CodeError = require('../utils/CodeError');

const directiveIf = 'x-if';
const directiveElseif = 'x-elseif';
const directiveElse = 'x-else';
const conditionTypes = {
  [directiveIf]: 'if',
  [directiveElseif]: 'elseif',
  [directiveElse]: 'else',
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
              type: conditionTypes[attributes[i].name.name],
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


function transformDirectiveCondition(ast, adapter) {
  traverse(ast, {
    JSXElement(path) {
      const { node } = path;
      const condition = getCondition(node);
      if (condition !== null && condition.value !== null && condition.type === conditionTypes[directiveIf]) {
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
          const attr = type === conditionTypes[directiveElse]
            ? t.jsxAttribute(t.jsxIdentifier(adapter[type]))
            : t.jsxAttribute(
              t.jsxIdentifier(adapter[type]),
              t.jsxExpressionContainer(value)
            );
          attributes.push(attr);
        });
      }
    }
  });
}

function transformDirectiveList(ast, code, adapter) {
  traverse(ast, {
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
            params = [left, t.identifier('index')];
          } else {
            // x-for={??? in value}
            throw new Error('Stynax error of x-for.');
          }
        } else {
          // x-for={value}, x-for={callExp()}, ...
          iterValue = expression;
          params = [t.identifier('item'), t.identifier('index')];
        }
        const parentJSXEl = path.findParent(p => p.isJSXElement());
        // Transform x-for iterValue to map function
        const properties = [
          t.objectProperty(params[0], params[0]),
          t.objectProperty(params[1], params[1])
        ];
        const loopFnBody = t.blockStatement([
          t.returnStatement(
            t.objectExpression(properties)
          )
        ]);
        const mapCallExpression = t.callExpression(
          t.memberExpression(iterValue, t.identifier('map')),
          [
            t.arrowFunctionExpression(params, loopFnBody)
          ]);
        const listItem = getListItem(iterValue);
        if (listItem) {
          const parentList = listItem.__listItem.parentList;
          if (parentList) {
            /**
             * Assign an new object to item
             * item: { ...item, info: item.info.map(i => {})
             * */
            const loopFnBodyLength = parentList.loopFnBody.body.length;
            const properties = parentList.loopFnBody.body[loopFnBodyLength - 1].argument.properties;
            const item = properties.find(({key}) => key.name === listItem.name);
            if (t.isMemberExpression(iterValue)) {
              if (t.isIdentifier(item.value)) {
                if (t.isIdentifier(iterValue.object)) {
                  item.value = t.objectExpression([
                    t.spreadElement(item.value),
                    t.objectProperty(iterValue.property, mapCallExpression)
                  ]);
                } else {
                  throw new CodeError(code, iterValue, iterValue.loc, "Currently doesn't support x-for={it in item.info.list} in nested list");
                }
              } else if (t.isObjectExpression(item.value)) {
                item.value.properties.push(
                  t.objectProperty(iterValue.property, mapCallExpression)
                );
              }
            } else if (t.isIdentifier(iterValue)) {
              item.value = mapCallExpression;
            }
          } else {
            throw new CodeError(code, iterValue, iterValue.loc, 'Nested x-for list only supports MemberExpression and Identifier，like x-for={item.list} or x-for={item}.');
          }
        } else {
          iterValue = mapCallExpression;
        }
        parentJSXEl.node.__jsxlist = {
          args: params,
          iterValue,
          loopFnBody,
          jsxplus: true
        };
        transformListJSXElement(path.parentPath.parentPath, adapter);
        path.remove();
      }
    }
  });
}

function transformComponentFragment(ast) {
  function transformFragment(path) {
    if (t.isJSXIdentifier(path.node.name, { name: 'Fragment' })) {
      path.get('name').replaceWith(t.jsxIdentifier('block'));
    }
  }

  traverse(ast, {
    JSXOpeningElement: transformFragment,
    JSXClosingElement: transformFragment,
  });
  return null;
}

function transformListJSXElement(path, adapter) {
  const { node } = path;
  const { attributes } = node.openingElement;
  if (node.__jsxlist && !node.__jsxlist.generated) {
    const { args, iterValue } = node.__jsxlist;
    path.traverse({
      Identifier(innerPath) {
        const {node: innerNode, parentPath: innerParentPath} = innerPath;
        if (args.find(arg => arg.name === innerNode.name)) {
          if (!(innerParentPath.isMemberExpression()
            && innerParentPath.get('property') === innerPath)) {
            innerNode.__listItem = {
              jsxplus: true,
              item: args[0].name,
              parentList: node.__jsxlist
            };
          }
        }
      }
    });
    attributes.push(
      t.jsxAttribute(
        t.jsxIdentifier(adapter.for),
        t.jsxExpressionContainer(iterValue)
      )
    );
    args.forEach((arg, index) => {
      attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier([adapter.forItem, adapter.forIndex][index]),
          t.stringLiteral(arg.name)
        )
      );
      // Mark skip ids.
      const skipIds = node.skipIds = node.skipIds || new Map();
      skipIds.set(arg.name, true);
    });

    node.__jsxlist.generated = true;
  }
}
module.exports = {
  parse(parsed, code, options) {
    if (parsed.renderFunctionPath) {
      transformDirectiveCondition(parsed.templateAST, options.adapter);
      transformDirectiveList(parsed.templateAST, code, options.adapter);
      transformComponentFragment(parsed.templateAST);
    }
  },
  _transformList: transformDirectiveList,
  _transformCondition: transformDirectiveCondition,
  _transformFragment: transformComponentFragment,
};
