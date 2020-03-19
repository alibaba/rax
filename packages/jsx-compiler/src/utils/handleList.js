const t = require('@babel/types');
const createBinding = require('./createBinding');
const createJSXBinding = require('./createJSXBinding');
const genExpression = require('../codegen/genExpression');
const handleValidIdentifier = require('./handleValidIdentifier');
const getListItem = require('./getListItem');
const findIndex = require('./findIndex');
const createIncrement = require('./createIncrement');

/**
 * @param {NodePath} containerPath - container node path
 * @param {Node} valueNode - property's value
 * @param {NodePath} parentPath - need transform path's parent path
 * @param {Node} forItem - for item node
 * @param {string} originalIndex - original for index name
 * @param {string} renamedIndex - renamed index name
 * @param {Array} properties - map return properties
 * @param {object} dynamicBinding - dynamic style generator
 * */
module.exports = function(
  containerPath, valueNode, parentPath, forItem,
  originalIndex, renamedIndex, properties, dynamicBinding) {
  const isAttr = parentPath.isJSXAttribute();
  const { node } = parentPath;
  // Check attribute name wheather is ref
  const isRef = isAttr && node.name.name === 'ref';
  const targetPath = isAttr ? parentPath.get('value') : parentPath;
  // Rename index node in expression
  const indexNodeVisitor = {
    Identifier(innerPath) {
      handleValidIdentifier(innerPath, () => {
        if (innerPath.node.name === originalIndex) {
          innerPath.node.name = renamedIndex;
        }
      });
    }
  };
  targetPath.traverse(indexNodeVisitor);
  if (containerPath) {
    containerPath.traverse(indexNodeVisitor);
  }
  // Avoid replace normal expression
  const listItem = getListItem(targetPath, true);
  if (listItem) {
    const listInfo = listItem.__listItem;
    let propertyValue = valueNode;
    // Handle current loop ref, attr name is ref and the list item is in current list
    if (isRef && listInfo.item === forItem.name) {
      const parentList = listInfo.parentList;
      const { loopFnBody } = parentList;
      propertyValue = t.binaryExpression('+',
        t.stringLiteral(createIncrement()), t.stringLiteral(renamedIndex));
      handleRef(loopFnBody, propertyValue, targetPath);
    }
    const originalExpression = isAttr ? node.value.expression : valueNode;

    let name;
    const addedNodeIndex = findIndex(properties, ({ value }) => genExpression(value) === genExpression(originalExpression));
    if (addedNodeIndex < 0 || properties[addedNodeIndex].key.__isFromMapFn) {
      properties.splice(addedNodeIndex, addedNodeIndex > -1);
      name = dynamicBinding.add({
        expression: originalExpression
      });
      properties.push(t.objectProperty(t.identifier(name), propertyValue));
    } else {
      name = properties[addedNodeIndex].key.name;
    }
    // {{xxx}}
    const replaceVariable = genExpression(t.memberExpression(forItem, t.identifier(name)));
    // If is attribute value, it need to add double quote
    const replaceNode = isAttr ? t.stringLiteral(createBinding(replaceVariable))
      : createJSXBinding(replaceVariable);
    // Record original expression
    replaceNode.__originalExpression = originalExpression;
    replaceNode.__index = targetPath.node.__index;
    node.value = replaceNode;
    // Record current properties info
    replaceNode.__properties = {
      value: properties,
      index: properties.length - 1
    };
    targetPath.replaceWith(replaceNode);
  }
};

/**
 * @param {Node} loopFnBody - current loop function body
 * @param {Node} propertyValue - the node which should be
 * inserted into current list return properties
 * @param {NodePath} targetPath - the attr value path
 */
function handleRef(loopFnBody, propertyValue, targetPath) {
  const registerRefsMethods = t.memberExpression(
    t.thisExpression(),
    t.identifier('_registerRefs')
  );
  loopFnBody.body.unshift(t.expressionStatement(t.callExpression(registerRefsMethods, [
    t.arrayExpression([
      t.objectExpression([t.objectProperty(t.stringLiteral('name'), propertyValue),
        t.objectProperty(t.stringLiteral('method'), targetPath.node.expression)])
    ])
  ])));
}
