const { isMiniApp, isWeChatMiniProgram } = require('universal-env');

function noop() {}

let API = {
  getSystemInfoSync: noop,
  setStorage: noop,
  setStorageSync: noop,
  setNavigationBar: noop,
  getStorageInfoSync: noop,
  getStorageSync: noop,
  removeStorageSync: noop,
  clearStorageSync: noop,
  switchTab: noop,
  redirectTo: noop,
  getImageInfo: noop,
  createSelectorQuery: noop
}

if (isMiniApp) {
  Object.keys(API).forEach(fn => {
    API[fn] = my[fn];
  })
} else if (isWeChatMiniProgram) {
  Object.keys(API).forEach(fn => {
    if (fn === 'removeStorageSync') {
      API[fn] = ({key}) => wx[fn](key);
    } else {
      API[fn] = wx[fn];
    }
  })
}
module.exports = API;
