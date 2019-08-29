/* global wx */

export function redirectTo(options) {
  wx.redirectTo(options);
}

export function navigateTo(options) {
  wx.navigateTo(options);
}

export function navigateBack(options) {
  wx.navigateBack(options);
}

export function getComponentLifecycle({ mount, unmount }) {
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
