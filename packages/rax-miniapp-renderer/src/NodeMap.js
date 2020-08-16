
export default class NodeMap {
  _map = new Map();

  _setMountNode(mountNode) {
    this.mountNode = mountNode;
  }

  get(vnode) {
    if (!vnode) return null;
    if (vnode.nodeName === 'BODY') return this.mountNode;
    return this._map.get(vnode.$$id);
  }

  set(vnode, node) {
    node.$$id = vnode.$$id;
    return this._map.set(vnode.$$id, node);
  }

  delete(vnode) {
    if (!vnode) return null;
    const node = this._map.get(vnode.$$id);
    if (node) traverseNodes(node, el => el.$$id && this._map.delete(el.$$id));
  }
}

/**
 * Traverse HTML Node in DFS (trailing call).
 * @param node {Node}
 * @param effect {Function}
 */
function traverseNodes(node, effect) {
  if (node.childNodes.length > 0) {
    for (let i = 0, l = node.childNodes.length; i < l; i++) {
      traverseNodes(node.childNodes[i], effect);
      effect(node.childNodes[i]);
    }
  }
  effect(node);
}
