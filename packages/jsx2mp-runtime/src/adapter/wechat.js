function getComponentLifecycle({ mount, unmount }) {
  function attached() {
    return mount.apply(this, arguments);
  }

  function detached() {
    return unmount.apply(this, arguments);
  }

  return {
    lifetimes: {
      attached,
      detached,
    },
    // Keep compatibility to wx base library version < 2.2.3
    attached,
    detached,
  };
}

function getComponentBaseConfig() {
  return {
    properties: {
      __tagId: null,
      __parentId: null,
    },
    options: {
      addGlobalClass: true,
    }
  };
}

export default {
  getComponentLifecycle,
  getComponentBaseConfig,
};
