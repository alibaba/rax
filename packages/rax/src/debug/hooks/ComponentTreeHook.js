function isNative(fn) {
  // Based on isNative() from Lodash
  const funcToString = Function.prototype.toString;
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const reIsNative = RegExp('^' + funcToString
    // Take an example native function source for comparison
    .call(hasOwnProperty)
    // Strip regex characters so we can use it for regex
    .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
    // Remove hasOwnProperty from the template to make it generic
    .replace(
      /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
      '$1.*?'
    ) + '$'
  );
  try {
    const source = funcToString.call(fn);
    return reIsNative.test(source);
  } catch (err) {
    return false;
  }
}

const canUseCollections =
  typeof Array.from === 'function' &&
  typeof Map === 'function' &&
  isNative(Map) &&
  Map.prototype != null &&
  typeof Map.prototype.keys === 'function' &&
  isNative(Map.prototype.keys) &&
  typeof Set === 'function' &&
  isNative(Set) &&
  Set.prototype != null &&
  typeof Set.prototype.keys === 'function' &&
  isNative(Set.prototype.keys)
;

let setItem;
let getItem;
let removeItem;
let getItemIDs;
let addRoot;
let removeRoot;
let getRootIDs;
let getKeyFromID;
let getIDFromKey;
let itemMap;
let rootIDSet;

if (canUseCollections) {
  itemMap = new Map();
  rootIDSet = new Set();

  setItem = (id, item) => {
    itemMap.set(id, item);
  };
  getItem = (id) => {
    return itemMap.get(id);
  };
  removeItem = (id) => {
    itemMap.delete(id);
  };
  getItemIDs = () => {
    return Array.from(itemMap.keys());
  };

  addRoot = (id) => {
    rootIDSet.add(id);
  };
  removeRoot = (id) => {
    rootIDSet.delete(id);
  };
  getRootIDs = () => {
    return Array.from(rootIDSet.keys());
  };
} else {
  const itemByKey = {};
  const rootByKey = {};

  getKeyFromID = (id) => {
    return '.' + id;
  };
  getIDFromKey = (key) => {
    return parseInt(key.substr(1), 10);
  };

  setItem = (id, item) => {
    const key = getKeyFromID(id);
    itemByKey[key] = item;
  };
  getItem = (id) => {
    const key = getKeyFromID(id);
    return itemByKey[key];
  };
  removeItem = (id) => {
    const key = getKeyFromID(id);
    delete itemByKey[key];
  };
  getItemIDs = () => {
    return Object.keys(itemByKey).map(getIDFromKey);
  };

  addRoot = (id) => {
    const key = getKeyFromID(id);
    rootByKey[key] = true;
  };
  removeRoot = (id) => {
    const key = getKeyFromID(id);
    delete rootByKey[key];
  };
  getRootIDs = () => {
    return Object.keys(rootByKey).map(getIDFromKey);
  };
}

let unmountedIDs = [];

function purgeDeep(id) {
  const item = getItem(id);
  if (item) {
    const { childIDs } = item;
    removeItem(id);
    childIDs.forEach(purgeDeep);
  }
}

function getDisplayName(element) {
  if (element == null) {
    return '#empty';
  } else if (typeof element === 'string' || typeof element === 'number') {
    return '#text';
  } else if (typeof element.type === 'string') {
    return element.type;
  } else {
    return element.type.displayName || element.type.name || 'Unknown';
  }
}

const ComponentTreeHook = {
  onBeforeMountComponent(id, element, parentID) {
    var item = {
      element,
      parentID,
      text: null,
      childIDs: [],
      isMounted: false,
      updateCount: 0,
    };
    setItem(id, item);
  },
  onBeforeUpdateComponent(id, element) {
    var item = getItem(id);
    if (!item || !item.isMounted) {
      return;
    }
    item.element = element;
  },

  onMountComponent(id) {
    var item = getItem(id);
    item.isMounted = true;
    var isRoot = item.parentID === 0;
    if (isRoot) {
      addRoot(id);
    }
  },

  onUpdateComponent(id) {
    var item = getItem(id);
    if (!item || !item.isMounted) {
      return;
    }
    item.updateCount++;
  },

  onUnmountComponent(id) {
    var item = getItem(id);
    if (item) {
      item.isMounted = false;
      var isRoot = item.parentID === 0;
      if (isRoot) {
        removeRoot(id);
      }
    }
    unmountedIDs.push(id);
  },
  getElement(id) {
    const item = getItem(id);
    return item ? item.element : null;
  },
  isMounted(id) {
    const item = getItem(id);
    return item ? item.isMounted : false;
  },
  purgeUnmountedComponents() {
    for (let i = 0; i < unmountedIDs.length; i++) {
      const id = unmountedIDs[i];
      purgeDeep(id);
    }
    unmountedIDs.length = 0;
  },
  getOwnerID(id) {
    const element = ComponentTreeHook.getElement(id);
    if (!element || !element._owner) {
      return null;
    }
    return element._owner._debugID;
  },
  getParentID(id) {
    const item = getItem(id);
    return item ? item.parentID : null;
  },
  getDisplayName(id) {
    const element = ComponentTreeHook.getElement(id);
    if (!element) {
      return null;
    }
    return getDisplayName(element);
  },
  getText(id) {
    const element = ComponentTreeHook.getElement(id);
    if (typeof element === 'string') {
      return element;
    } else if (typeof element === 'number') {
      return '' + element;
    } else {
      return null;
    }
  },
  getUpdateCount(id) {
    const item = getItem(id);
    return item ? item.updateCount : 0;
  },
  getChildIDs(id) {
    const item = getItem(id);
    return item ? item.childIDs : [];
  },
  getOwnerID(id) {
    const element = ComponentTreeHook.getElement(id);
    if (!element || !element._owner) {
      return null;
    }
    return element._owner._debugID;
  },
  getRegisteredIDs: getItemIDs
};

export default ComponentTreeHook;
