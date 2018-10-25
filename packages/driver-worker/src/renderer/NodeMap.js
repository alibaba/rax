export default class NodeMap extends Map {
  get(vnode) {
    if (!vnode) return null;
    if (vnode.nodeName === 'BODY') return document.body;
    return super.get(vnode.$$id);
  }

  set(vnode, node) {
    node.$$id = vnode.$$id;
    return super.set(vnode.$$id, node);
  }

  delete(vnode) {
    if (!vnode) return null;
    return super.delete(vnode.$$id);
  }
}

export const sharedNodeMap = new NodeMap();
