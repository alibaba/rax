const { default: traverse, NodePath } = require('@babel/traverse');
const t = require('@babel/types');

/**
 * Traverse a node path.
 * @param nodeOrPath
 * @param visitor
 */
module.exports = function traverseNodePath(nodeOrPath, visitor) {
  if (nodeOrPath == null) return;

  if (nodeOrPath instanceof NodePath) {
    nodeOrPath.traverse(visitor);
  } else if (t.isFile(nodeOrPath)) {
    traverse(nodeOrPath, visitor);
  } else if (t.isStatement(nodeOrPath)) {
    // Only can traverse file path.
    const file = t.file(t.program([nodeOrPath]));
    traverse(file, visitor);
  } else {
    // Expression should be wrapped in expression statement.
    // Only can traverse file path.
    const file = t.file(t.program([t.expressionStatement(nodeOrPath)]));
    traverse(file, visitor);
  }
};
