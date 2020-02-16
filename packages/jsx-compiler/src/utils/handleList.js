const t = require('@babel/types');
const createBinding = require('./createBinding');
const genExpression = require('../codegen/genExpression');
const handleValidIdentifier = require('./handleValidIdentifier');
const getListItem = require('./getListItem');
const findIndex = require('./findIndex');
const createIncrement = require('./createIncrement');

/**
 * @param {NodePath} containerPath - container node path
 * @param {Node} valueNode - property's value
 * @param {NodePath} attrPath - jsx attribute path
 * @param {Node} forItem - for item node
 * @param {string} originalIndex - original for index name
 * @param {string} renamedIndex - renamed index name
 * @param {Array} properties - map return properties
 * @param {object} dynamicBinding - dynamic style generator
 * */
module.exports = function(
  containerPath, valueNode, attrPath, forItem,
  originalIndex, renamedIndex, properties, dynamicBinding) {
  const { node } = attrPath;
  // Check attribute name wheather is ref
  const isRef = node.name.name === 'ref';
  const attrValuePath = attrPath.get('value');
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
  attrValuePath.traverse(indexNodeVisitor);
  if (containerPath) {
    containerPath.traverse(indexNodeVisitor);
  }
  // Avoid replace normal expression
  const listItem = getListItem(attrValuePath, true);
  if (listItem) {
    const listInfo = listItem.__listItem;
    let propertyValue = valueNode;
    // Handle current loop ref, attr name is ref and the list item is in current list
    if (isRef && listInfo.item === forItem.name) {
      const parentList = listInfo.parentList;
      const { loopFnBody } = parentList;
      propertyValue = t.binaryExpression('+',
        t.stringLiteral(createIncrement()), t.stringLiteral(renamedIndex));
      handleRef(loopFnBody, propertyValue, attrValuePath);
    }
    const name = dynamicBinding.add({
      expression: node.value.expression
    });
    if (!properties.some(
      pty => pty.key.name === name)) {
      const addedNodeIndex = findIndex(properties, ({ value }) => value === node.value.expression);
      if (addedNodeIndex > -1) {
        properties.splice(addedNodeIndex, 1);
      }
      properties.push(t.objectProperty(t.identifier(name), propertyValue));
    }
    const replaceNode = t.stringLiteral(
      createBinding(genExpression(t.memberExpression(forItem, t.identifier(name))))
    );
    // Record original expression
    replaceNode.__originalExpression = node.value.expression;
    node.value = replaceNode;
    // Record current properties info
    replaceNode.__properties = {
      value: properties,
      index: properties.length - 1
    };
  }
};

/**
 * @param {Node} loopFnBody - current loop function body
 * @param {Node} propertyValue - the node which shoudl be
 * inserted into current list return properties
 * @param {NodePath} attrValuePath - the attr value path
 */
function handleRef(loopFnBody, propertyValue, attrValuePath) {
  const registerRefsMethods = t.memberExpression(
    t.thisExpression(),
    t.identifier('_registerRefs')
  );
  loopFnBody.body.unshift(t.expressionStatement(t.callExpression(registerRefsMethods, [
    t.arrayExpression([
      t.objectExpression([t.objectProperty(t.stringLiteral('name'), propertyValue),
        t.objectProperty(t.stringLiteral('method'), attrValuePath.node.expression)])
    ])
  ])));
}
