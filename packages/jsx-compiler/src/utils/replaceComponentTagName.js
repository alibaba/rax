module.exports = function replaceComponentTagName(path, tagNameNode) {
  const { node, parent } = path;
  node.name = tagNameNode;
  if (parent.closingElement) {
    parent.closingElement.name = tagNameNode;
  }
};
