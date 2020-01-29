const t = require('@babel/types');
const getListItem = require('./getListItem');
const CodeError = require('./CodeError');
/**
 * Assign an new object to item
 * item: { ...item, info: item.info.map(i => {})
 * @param {Expression} mapExpression map function expression
 * @param {Node} forNode
 * @return {Array} [forNode, parentList]
 * */
module.exports = function(mapCallExpression, forNode, code) {
  // through getListItem check forNode
  const listItem = getListItem(forNode);
  if (!listItem) return [mapCallExpression];
  const parentList = listItem.__listItem.parentList;
  const { loopFnBody } = parentList;
  const loopFnBodyLength = loopFnBody.body.length;
  const properties = loopFnBody.body[loopFnBodyLength - 1].argument.properties;
  const forItem = properties.find(({ key }) => key.name === listItem.name);
  if (t.isIdentifier(forNode)) {
    forItem.value = mapCallExpression;
  }
  if (t.isMemberExpression(forNode) || t.isCallExpression(forNode)) {
    switch (forItem.value.type) {
      case 'Identifier':
        if (t.isIdentifier(forNode.object)) {
          forItem.value = t.objectExpression([
            t.spreadElement(forItem.value),
            t.objectProperty(forItem.value, mapCallExpression)
          ]);
        } else if (t.isCallExpression(forNode)) {
          // handle list.filter().map()
          if (!t.isIdentifier(forNode.callee.object)) {
            throw new CodeError(code, forNode, forNode.loc, "Currently doesn't support render list by multilevel object, like item.info.list.");
          }
          forItem.value = t.objectExpression([
            t.spreadElement(forItem.value),
            t.objectProperty(forItem.value, mapCallExpression)
          ]);
          forNode = listItem;
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
  return [forNode, parentList];
};
