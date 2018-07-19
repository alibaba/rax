import {
  getStorageSync,
  setStorageSync,
  getStorage,
  setStorage
} from './storage';
import { getSetting, getUserInfo, canIUse } from './common';
import { navigateTo, navigateBack } from './navigator';

export {
  getStorageSync,
  setStorageSync,
  getStorage,
  setStorage,
  login,
  getSetting,
  getUserInfo,
  canIUse,
  navigateTo,
  navigateBack,
  setNavigationBar,
  getSystemInfoSync,
  call,
  showToast,
  showLoading,
  pageScrollTo,
  switchTab
};

function noop() { }
function switchTab() { }
function pageScrollTo() { }
function showLoading() { }
function showToast() { }
function call(type, options) {
  if (type === 'mtop') {
    options.success();
  } else {
    options.success();
  }
}
function login() { }
function setNavigationBar() { }
function getSystemInfoSync() { }

let callCount = 0;
function $call(modKey, params, onSuccess = noop, onFail = noop) {
  const [module, method] = modKey.split('.');

  const callId = ++callCount;
  function callEndHandler(evt) {
    if (
      evt &&
      evt.data &&
      evt.data.type === 'callEnd' &&
      evt.data.callId === callId
    ) {
      removeEventListener('message', callEndHandler);

      const { status, result, err } = evt.data;
      if (status === 'resolved') {
        onSuccess(result);
      } else {
        console.error(
          `failed to exec ${module}.${method}(${JSON.stringify(
            params,
            null,
            2
          )})`
        );
        onFail(err);
      }
    }
  }

  addEventListener('message', callEndHandler);

  postMessage({
    type: 'call',
    module,
    method,
    params,
    callId
  });
}