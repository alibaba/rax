const t = require('@babel/types');
const handleList = require('./handleList');

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
    if (node.__originalExpression) {
      node.__properties.value.splice(node.__properties.index, 1);
      node.expression = node.__originalExpression;
    }
    handleList(null, node.expression, path, ...args);
  }
};
