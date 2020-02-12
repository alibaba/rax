const t = require('@babel/types');
const createBinding = require('./createBinding');
const genExpression = require('../codegen/genExpression');
const handleValidIdentifier = require('./handleValidIdentifier');
const getListItem = require('./getListItem');
const findIndex = require('./findIndex');

/**
 * @param {NodePath} containerPath - container node path
 * @param {NodePath} path - jsx attribute path
 * @param {Node} forItem - for item node
 * @param {string} originalIndex - original for index name
 * @param {string} renamedIndex - renamed index name
 * @param {Array} properties - map return properties
 * @param {object} dynamicBinding - dynamic style generator
 * @param {Node} valueNode - property's value
 * @return {boolean} useCreateStyle
 * */
module.exports = function(containerPath, path, forItem, originalIndex, renamedIndex, properties, dynamicBinding, valueNode) {
  const { node } = path;
  const valuePath = path.get('value');
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
  valuePath.traverse(indexNodeVisitor);
  if (containerPath) {
    containerPath.traverse(indexNodeVisitor);
  }
  // Avoid replace normal expression
  if (getListItem(valuePath, true)) {
    const name = dynamicBinding.add({
      expression: node.value.expression
    });
    if (!properties.some(
      pty => pty.key.name === name)) {
      const addedNodeIndex = findIndex(properties, ({ value }) => value === node.value.expression);
      if (addedNodeIndex > -1) {
        properties.splice(addedNodeIndex, 1);
      }
      properties.push(t.objectProperty(t.identifier(name), valueNode));
    }
    const replaceNode = t.stringLiteral(
      createBinding(genExpression(t.memberExpression(forItem, t.identifier(name))))
    );
    // Record original expression
    replaceNode.__originalExpression = node.value.expression;
    node.value = replaceNode;
    // Record current properties info
    replaceNode.__properties = {
      properties,
      index: properties.length - 1
    };
  }
};
