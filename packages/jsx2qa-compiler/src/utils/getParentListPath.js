const genExpression = require('../codegen/genExpression');
const quickAppConst = require('../const');
/**
 * Get parent list path
 * @param {NodePath} path - current node path
 * @param {object} adapter
 * @return {NodePath} parent list path
 */
module.exports = function(path) {
  return path.findParent(parentPath => {
    if (parentPath.isJSXElement()) {
      const attributes = parentPath.node.openingElement.attributes;
      return attributes.some(attr => genExpression(attr.name) === quickAppConst.for);
    }
    return false;
  });
};
