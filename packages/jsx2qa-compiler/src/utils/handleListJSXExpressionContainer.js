const t = require('@babel/types');
const handleList = require('./handleList');
const findIndex = require('./findIndex');

/**
 * @param {NodePath} path - jsx attribute path
 * @param {Node} forItem - for item node
 * @param {string} originalIndex - original for index name
 * @param {string} renamedIndex - renamed index name
 * @param {Array} properties - map return properties
 * @param {object} dynamicBinding - dynamic style generator
 */
module.exports = function(path, ...args) {
  const node = path.node;
  // Out of the map
  if (!(t.isCallExpression(node.expression) && t.isIdentifier(node.expression.callee.property, { name: 'map' }))) {
    // Mark current loop
    path.node.__index = args[2];
    if (node.__originalExpression) {
      const propertyIndex = findIndex(node.__properties, (property) => property === node.__originalExpression);
      node.__properties.splice(propertyIndex, 1);
      node.expression = node.__originalExpression;
    }
    handleList(null, node.expression, path, ...args);
  }
};
