export default class NodeMap {
  _map = new Map();

  get(vnode) {
    if (!vnode) return null;
    if (vnode.nodeName === 'BODY') return document.body;
    return this._map.get(vnode.$$id);
  }

  set(vnode, node) {
    node.$$id = vnode.$$id;
    return this._map.set(vnode.$$id, node);
  }

  delete(vnode) {
    if (!vnode) return null;
    return this._map.delete(vnode.$$id);
  }
}

export const sharedNodeMap = new NodeMap();
