import Element from './element';
import cache from '../utils/cache';

function simplify(node) {
  const domInfo = node.$$domInfo;
  const simpleNode = {};
  for (let attr in domInfo) {
    simpleNode[attr] = domInfo[attr];
  }
  simpleNode.behavior = node.behavior;
  cache.setNode(node.__pageId, node.$$nodeId, node);
  if (node.id) {
    node.$_tree.updateIdMap(node.id, node);
  }
  return simpleNode;
}

function traverseTree(node, action) {
  if (!node || !node.children) {
    return;
  }
  let copiedNode;
  let queue = [];
  queue.push(node);
  while (queue.length) {
    let curNode = queue.shift();
    const result = action(curNode);
    if (!copiedNode) {
      copiedNode = result;
      copiedNode.children = [];
    } else {
      curNode.__parent.children = curNode.__parent.children || [];
      curNode.__parent.children.push(result);
    }
    if (curNode.$_children && curNode.$_children.length) {
      curNode.$_children.forEach(n => n.__parent = result);
      queue = queue.concat(curNode.$_children);
    }
    if (!result.children) {
      result.children = [];
    }
  }
  return copiedNode;
}

class RootElement extends Element {
  $$init(options, tree) {
    super.$$init(options, tree);
    this.pendingRender = false;
    this.renderStacks = [];
  }

  $$destroy() {
    super.$$destroy();
    this.pendingRender = null;
    this.renderStacks = null;
  }

  get _path() {
    return 'root';
  }
  get _root() {
    return this;
  }

  enqueueRender(payload) {
    this.renderStacks.push(payload);
    if (this.pendingRender) return;
    this.executeRender();
  }

  executeRender() {
    this.pendingRender = true;
    setTimeout(() => {
      // perf.start(SET_DATA);
      this.pendingRender = false;
      // TODO: Process data from array to obj
      // type 1: [_path, number, number, Element]
      // type 2: {path: '', value: ''}
      for (let i = 0, j = this.renderStacks.length; i < j; i++) {
        const item = this.renderStacks[i];
        const ElementNode = item[3];
        const simplifiedNode = traverseTree(ElementNode, simplify);
        this.renderStacks[i][3] = simplifiedNode;
      }
      // // this.renderStacks: [_path, number, number, Element]
      this.$$trigger('render', { args: this.renderStacks });
      this.renderStacks = [];
    }, 0);
  }
}

export default RootElement;

