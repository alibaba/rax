const { MINIAPP, WECHAT_MINIPROGRAM} = require('./constants');

module.exports = {
  getSystemInfoSync: {
    [MINIAPP]: my.getSystemInfoSync,
    [WECHAT_MINIPROGRAM]: wx.getSystemInfoSync
  },
  setStorage: {
    [MINIAPP]: my.setStorage,
    [WECHAT_MINIPROGRAM]: wx.setStorage
  },
  setStorageSync: {
    [MINIAPP]: my.setStorageSync,
    [WECHAT_MINIPROGRAM]: wx.setStorageSync
  },
  setNavigationBar: {
    [MINIAPP]: my.setNavigationBar,
    [WECHAT_MINIPROGRAM]: wx.setNavigationBarTitle
  },
  getStorageInfoSync: {
    [MINIAPP]: my.getStorageInfoSync,
    [WECHAT_MINIPROGRAM]: wx.getStorageInfoSync
  },
  getStorageSync: {
    [MINIAPP]: my.getStorageSync,
    [WECHAT_MINIPROGRAM]: wx.getStorageSync
  },
  removeStorageSync: {
    [MINIAPP]: ({key}) => my.removeStorageSync({key}),
    [WECHAT_MINIPROGRAM]: ({key}) => wx.removeStorageSync(key)
  },
  clearStorageSync: {
    [MINIAPP]: my.clearStorageSync,
    [WECHAT_MINIPROGRAM]: wx.clearStorageSync
  },
  switchTab: {
    [MINIAPP]: my.switchTab,
    [WECHAT_MINIPROGRAM]: wx.switchTab
  },
  redirectTo: {
    [MINIAPP]: my.redirectTo,
    [WECHAT_MINIPROGRAM]: wx.redirectTo
  },
  getImageInfo: {
    [MINIAPP]: my.getImageInfo,
    [WECHAT_MINIPROGRAM]: wx.getImageInfo
  },
  createSelectorQuery: {
    [MINIAPP]: my.createSelectorQuery,
    [WECHAT_MINIPROGRAM]: wx.createSelectorQuery
  }

}
