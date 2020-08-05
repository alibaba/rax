import { isMiniApp, isWeChatMiniProgram, isByteDanceMicroApp } from 'universal-env';

export const appCycles = {};

/**
 * Add app lifecycle callback
 * @param {string} cycle cycle name
 * @param {function} callback cycle callback
 */
function addAppLifeCycle(cycle, callback) {
  if (typeof callback === 'function') {
    const cycles = appCycles[cycle] = appCycles[cycle] || [];
    cycles.push(callback);
  }
}

function injectLifeCycle(config, name) {
  const original = config[name];
  config[name] = function(...args) {
    original && original(args);
    appCycles[name] && appCycles[name].forEach(cycle => {
      cycle(args);
    });
  };
}

export function useAppLaunch(callback) {
  addAppLifeCycle('onLaunch', callback);
}

export function useAppShow(callback) {
  addAppLifeCycle('onShow', callback);
}

export function useAppHide(callback) {
  addAppLifeCycle('onHide', callback);
}

export function useAppError(callback) {
  addAppLifeCycle('onError', callback);
}

export function useAppShare(callback) {
  addAppLifeCycle('onShare', callback);
}

export function usePageNotFound(callback) {
  addAppLifeCycle('onPageNotFound', callback);
}

export function enhanceAppLifeCycle(dynamicConfig) {
  injectLifeCycle(dynamicConfig, 'onLaunch');
  injectLifeCycle(dynamicConfig, 'onShow');
  injectLifeCycle(dynamicConfig, 'onHide');
  injectLifeCycle(dynamicConfig, 'onError');
}

if (isWeChatMiniProgram || isMiniApp || isByteDanceMicroApp) {
  window.addEventListener('appshare', ({ context, shareInfo, options }) => {
    if (appCycles.onShare) {
      const callback = appCycles.onShare[0];
      shareInfo.content = context ? callback.call(context, options) : callback(options);
    }
  });
  window.addEventListener('pagenotfound', ({ context }) => {
    if (appCycles.onPageNotFound) {
      appCycles.onPageNotFound.forEach((callback) => {
        context ? callback.call(context) : callback();
      });
    }
  });
}

