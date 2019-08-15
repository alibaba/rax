/* global wx */

function redirectTo(option) {
  wx.redirectTo(option);
}

function navigateTo(option) {
  wx.navigateTo(option);
}

function navigateBack(option) {
  wx.navigateBack(option);
}

function getComponentLifecycle({ mount, unmount }) {
  return {
    lifetimes: {
      attached: function() {
        mount.apply(this, arguments);
      },
      detached: function() {
        unmount.apply(this, arguments);
      },
    },
    // 以下保持对 <2.2.3 版本基础库的兼容
    attached: function() {
      mount.apply(this, arguments);
    },
    detached: function() {
      unmount.apply(this, arguments);
    }
  };
}

export default {
  redirectTo,
  navigateTo,
  navigateBack,
  getComponentLifecycle
};
