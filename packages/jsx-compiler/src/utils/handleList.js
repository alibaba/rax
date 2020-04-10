const t = require('@babel/types');
const createBinding = require('./createBinding');
const createJSXBinding = require('./createJSXBinding');
const genExpression = require('../codegen/genExpression');
const handleValidIdentifier = require('./handleValidIdentifier');
const getListItem = require('./getListItem');
const findIndex = require('./findIndex');
const createIncrement = require('./createIncrement');
const handleRefAttr = require('./handleRefAttr');
const CodeError = require('./CodeError');

/**
 * @param {NodePath} containerPath - container node path
 * @param {Node} valueNode - property's value
 * @param {NodePath} parentPath - need transform path's parent path
 * @param {Node} forItem - for item node
 * @param {string} originalIndex - original for index name
 * @param {string} renamedIndex - renamed index name
 * @param {Array} properties - map return properties
 * @param {object} dynamicBinding - dynamic style generator
 * @param {string} code - original code
 * @param {object} adapter - adapter
 * */
module.exports = function(
  containerPath, valueNode, parentPath, forItem,
  originalIndex, renamedIndex, properties, dynamicBinding, code, adapter) {
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
      const renamedIndexNode = t.identifier(renamedIndex);
      propertyValue = t.binaryExpression('+',
        t.stringLiteral(createIncrement()), renamedIndexNode);
      if (targetPath.isJSXExpressionContainer()) {
        handleRef(loopFnBody,
          handleRefAttr(targetPath.parentPath, targetPath.node.expression, propertyValue, adapter, renamedIndexNode)
        );
      } else {
        throw new CodeError(code, node, targetPath.loc, "Ref's type must be JSXExpressionContainer, like <View ref = { scrollRef }/>");
      }
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
    // Record current properties
    replaceNode.__properties = properties;
    targetPath.replaceWith(replaceNode);
  }
};

/**
 * @param {Node} loopFnBody - current loop function body
 * @param {Node} refInfo - ref info
 */
function handleRef(loopFnBody, refInfo) {
  const registerRefsMethods = t.memberExpression(
    t.thisExpression(),
    t.identifier('_registerRefs')
  );
  loopFnBody.body.unshift(t.expressionStatement(t.callExpression(registerRefsMethods, [
    t.arrayExpression([
      t.objectExpression([t.objectProperty(t.stringLiteral('name'), refInfo.name),
        t.objectProperty(t.stringLiteral('method'), refInfo.method),
        t.objectProperty(t.stringLiteral('type'), refInfo.type ),
        t.objectProperty(t.stringLiteral('id'), refInfo.id )])
    ])
  ])));
}
