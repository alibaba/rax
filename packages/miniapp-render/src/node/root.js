import Element from './element';
import cache from '../utils/cache';
import safeFindProperty from '../utils/safeFindProperty';

function simplify(node) {
  const domInfo = node.$$domInfo;
  const simpleNode = {};
  for (let attr in domInfo) {
    simpleNode[attr] = domInfo[attr];
  }
  simpleNode.behavior = node.behavior;
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
      // type 1: { path, start, deleteCount, item? } => need to simplify item
      // type 2: { path, value }
      const renderObject = {};
      const internal = cache.getDocument(this.__pageId)._internal;
      for (let i = 0, j = this.renderStacks.length; i < j; i++) {
        const renderTask = this.renderStacks[i];
        if (renderTask.type === 'children') {
          const ElementNode = renderTask.item;
          const simplifiedNode = traverseTree(ElementNode, simplify);
          renderTask.item = simplifiedNode;
        }
        if (!internal.$spliceData) {
          // there is no need to aggregate arrays if $batchedUpdate and $spliceData exist
          const path = renderTask.path;
          if (renderTask.type === 'children') {
            renderObject[path] = renderObject[path] || safeFindProperty(internal.data, path) || [];
            if (renderTask.item) {
              renderObject[path].splice(renderTask.start, renderTask.deleteCount, renderTask.item);
            } else {
              renderObject[path].splice(renderTask.start, renderTask.deleteCount);
            }
          } else {
            renderObject[path] = renderTask.value;
          }
        }
      }

      this.$$trigger('render', { args: internal.$spliceData ? this.renderStacks : renderObject });
      this.renderStacks = [];
    }, 0);
  }
}

export default RootElement;

