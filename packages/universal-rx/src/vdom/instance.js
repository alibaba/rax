import Host from './host';

/**
 * Instance manager
 */
const KEY = '$$instance';

export default {
  set(node, instance) {
    if (!node[KEY]) {
      node[KEY] = instance;
      // Record root instance to roots map
      if (instance.rootID) {
        Host.roots[instance.rootID] = instance;
      }
    }
  },
  get(node) {
    return node[KEY];
  },
  remove(node) {
    let instance = this.get(node);
    if (instance) {
      node[KEY] = null;
      if (instance.rootID) {
        delete Host.roots[instance.rootID];
      }
    }
  }
};
