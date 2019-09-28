module.exports = function replaceComponentTagName(path, tagNameNode) {
  const { node, parent } = path;
  node.name = tagNameNode;
  if (parent.closeTagNameNode) {
    parent.closeTagNameNode.name = tagNameNode;
  }
};
