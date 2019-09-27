import EventTarget from './EventTarget';
import { mutate } from './MutationObserver';
import findWhere from '../shared/findWhere';
import splice from '../shared/splice';

function mutateChildNodes(node) {
  if (node && node.childNodes) {
    for (let i = 0, len = node.childNodes.length; i < len; i++) {
      const child = node.childNodes[i];
      mutate(node, 'childList', { addedNodes: [child] });
      mutateChildNodes(child);
    }
  }
}

export default class Node extends EventTarget {
  constructor(nodeType, nodeName) {
    super();
    this.nodeType = nodeType;
    this.nodeName = nodeName;
    this.childNodes = [];
  }
  get nextSibling() {
    let p = this.parentNode;
    if (p) return p.childNodes[findWhere(p.childNodes, this, true) + 1];
  }
  get previousSibling() {
    let p = this.parentNode;
    if (p) return p.childNodes[findWhere(p.childNodes, this, true) - 1];
  }
  get firstChild() {
    return this.childNodes[0];
  }
  get lastChild() {
    return this.childNodes[this.childNodes.length - 1];
  }
  appendChild(child) {
    this.insertBefore(child);
    return child;
  }
  insertBefore(child, ref) {
    child.remove();
    child.parentNode = this;

    if (ref) {
      splice(this.childNodes, ref, child);
      mutate(this, 'childList', { addedNodes: [child], nextSibling: ref });
    } else {
      this.childNodes.push(child);
      mutate(this, 'childList', { addedNodes: [child] });
    }

    mutateChildNodes(child);
    return child;
  }
  replaceChild(child, ref) {
    if (ref.parentNode === this) {
      this.insertBefore(child, ref);
      ref.remove();
      return ref;
    }
  }
  removeChild(child) {
    splice(this.childNodes, child);
    mutate(this, 'childList', { removedNodes: [child] });
    return child;
  }
  remove() {
    if (this.parentNode) this.parentNode.removeChild(this);
  }
}
