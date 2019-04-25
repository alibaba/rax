module.exports = class Node {
  constructor(tag, attrs, children = []) {
    this.tag = tag;
    this.attrs = attrs;
    this.children = children;
  }

  setAttribute(prop, val) {
    this.attrs[prop] = val;
  }

  appendChild(node) {
    this.children.push(node);
  }
}
