const t = require('@babel/types');
const getListItem = require('./getListItem');
const CodeError = require('./CodeError');
const genExpression = require('../codegen/genExpression');

/**
 * Assign an new object to item
 * item: { ...item, info: item.info.map(i => {})
 * @param {Expression} mapExpression map function expression
 * @param {Node} forNode
 * @params {object} parentList parent list info
 * @return {Array} [forNode, parentList]
 * */
module.exports = function(mapCallExpression, forNode, parentList, dynamicValue, code) {
  if (!parentList) return mapCallExpression;
  const parentListItemNode = getListItem(forNode);
  const { loopFnBody } = parentList;
  const loopFnBodyLength = loopFnBody.body.length;
  const properties = loopFnBody.body[loopFnBodyLength - 1].argument.properties;
  let forItem;
  const parentListItem = parentList.args[0].name;
  if (parentListItemNode && isItemAsProperty(genExpression(forNode), parentListItem) ) {
    forItem = properties.find(({ key, value }) => key.name === parentListItem);
    if (t.isIdentifier(forNode)) {
      forItem.value = mapCallExpression;
    }

    if (t.isMemberExpression(forNode) || t.isCallExpression(forNode)) {
      switch (forItem.value.type) {
        case 'Identifier':
          if (t.isIdentifier(forNode.object)) {
            forItem.value = t.objectExpression([
              t.spreadElement(forItem.value),
              t.objectProperty(forNode.property, mapCallExpression)
            ]);
          } else if (t.isCallExpression(forNode)) {
            // handle list.filter().map()
            if (!t.isIdentifier(forNode.callee.object)) {
              throw new CodeError(code, forNode, forNode.loc, "Currently doesn't support render list by multilevel object, like item.info.list.");
            }
            forItem.value = t.objectExpression([
              t.spreadElement(forItem.value),
              t.objectProperty(forNode.property, mapCallExpression)
            ]);
            forNode = parentListItemNode;
          } else {
            throw new CodeError(code, forNode, forNode.loc, "Currently doesn't support render list by multilevel object, like item.info.list.");
          }
          break;
        case 'ObjectExpression':
          forItem.value.properties.push(
            t.objectProperty(forNode.property, mapCallExpression)
          );
          break;
      }
    }
  } else {
    const name = dynamicValue.add({ expression: forNode });
    forNode = t.identifier(name);
    // Mark as list item
    forNode.__listItem = {
      item: parentListItem
    };
    forItem = t.objectProperty(t.identifier(name), mapCallExpression);
    properties.push(forItem);
  }

  return forNode;
};

// Check item wheather is property, like item.a.map() or item().map() or item[xxx].map
function isItemAsProperty(code, item) {
  // ^item(\.|\[|\())
  const regExp = new RegExp('^' + item + '(\\.|\\(|\\[)');
  return regExp.test(code) || code === item;
}
