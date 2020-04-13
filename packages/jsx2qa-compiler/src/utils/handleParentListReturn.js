const t = require('@babel/types');
const getListItem = require('./getListItem');
const CodeError = require('./CodeError');
const genExpression = require('../codegen/genExpression');
const handleValidIdentifier = require('./handleValidIdentifier');
const traverse = require('./traverseNodePath');

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
  const propertyRelatedMapFn = getProperty(forNode, properties);
  if (parentListItemNode && (isItemAsProperty(forNode, parentListItem) || propertyRelatedMapFn) ) {
    if (propertyRelatedMapFn) {
      propertyRelatedMapFn.value = mapCallExpression;
    } else {
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

/**
 * Check item wheather is property, like item.a.map() or item().map() or item[xxx].map
 * @param {Node} forNode looped node
 * @param {string} item parent list item
 */
function isItemAsProperty(forNode, item) {
  const code = genExpression(forNode);
  // ^item(\.|\[|\())
  const regExp = new RegExp('^' + item + '(\\.|\\(|\\[)');
  return regExp.test(code) || code === item;
}

/**
 * Get property which is from parent list map funtion
 * @param {Node} forNode looped node
 * @param {object} properties parent list return properties
 */
function getProperty(forNode, properties) {
  let propertyRelatedMapFn;
  if (t.isIdentifier(forNode)) {
    propertyRelatedMapFn = getPropertyRelatedMapFn(forNode, properties);
  } else {
    traverse(forNode, {
      Identifier(innerPath) {
        handleValidIdentifier(innerPath, () => {
          propertyRelatedMapFn = getPropertyRelatedMapFn(innerPath.node, properties);
        });
        if (propertyRelatedMapFn) return;
      }
    });
  }
  return propertyRelatedMapFn;
}

function getPropertyRelatedMapFn(identier, properties) {
  return properties.find(({key}) => key.name === identier.name && key.__isFromMapFn);
}
