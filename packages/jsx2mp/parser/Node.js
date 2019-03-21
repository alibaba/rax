class Node {
  constructor(tag, attrs, children) {
    this.tag = tag;
    this.attrs = attrs;
    this.children = children || [];
  }

  addChild(node) {
    this.children.push(node);
  }
}

module.exports = Node;
