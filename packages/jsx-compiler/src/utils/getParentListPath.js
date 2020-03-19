const genExpression = require('../codegen/genExpression');

/**
 * Get parent list path
 * @param {NodePath} path - current node path
 * @param {object} adapter
 * @return {NodePath} parent list path
 */
module.exports = function(path, adapter) {
  return path.findParent(parentPath => {
    if (parentPath.isJSXElement()) {
      const attributes = parentPath.node.openingElement.attributes;
      return attributes.some(attr => genExpression(attr.name) === adapter.for);
    }
    return false;
  });
};
