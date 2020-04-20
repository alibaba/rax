import { isMiniApp, isWeChatMiniProgram } from 'universal-env';

const SHOW = 'show';
const HIDE = 'hide';
const LANUCH = 'launch';
const ERROR = 'error';
const NOT_FOUND = 'notfound';
const SHARE = 'share';

export const appCycles = {};

/**
 * Emit life cycle callback
 * @param {string} cycle cycle name
 * @param {object} context callback's context when executed
 * @param  {...any} args callback params
 */
export function emit(cycle, context, ...args) {
  if (appCycles.hasOwnProperty(cycle)) {
    const cycles = appCycles[cycle];
    let fn;
    if (cycle === SHARE) {
      // In MiniApp, it need return callback result as share info, like { title, desc, path }
      args[0].content = context ? cycles[0].call(context, args[1]) : cycles[0](args[1]);
    } else {
      while (fn = cycles.shift()) { // eslint-disable-line
        context ? fn.apply(context, args) : fn(...args);
      }
    }
  }
}

function useAppLifecycle(cycle, callback) {
  const cycles = appCycles[cycle] = appCycles[cycle] || [];
  cycles.push(callback);
}

export function useAppLaunch(callback) {
  useAppLifecycle(LANUCH, callback);
}

export function useAppShow(callback) {
  useAppLifecycle(SHOW, callback);
}

export function useAppHide(callback) {
  useAppLifecycle(HIDE, callback);
}

export function useAppError(callback) {
  useAppLifecycle(ERROR, callback);
}

export function usePageNotFound(callback) {
  useAppLifecycle(NOT_FOUND, callback);
}

export function useAppShare(callback) {
  useAppLifecycle('appshare', callback);
}

if (isMiniApp || isWeChatMiniProgram) {
  window.addEventListener(LANUCH, ({ options, context }) => {
    emit(LANUCH, context, options);
  });
  window.addEventListener('appshow', ({ options, context }) => {
    emit(SHOW, context, options);
  });
  window.addEventListener('apphide', ({ context }) => {
    emit(HIDE, context);
  });
  window.addEventListener('apperror', ({ context, error }) => {
    emit(ERROR, context, error);
  });
  window.addEventListener('pagenotfound', ({ context }) => {
    emit(NOT_FOUND, context);
  });
  window.addEventListener('appshare', ({ context, shareInfo, options }) => {
    emit(SHARE, context, shareInfo, options);
  });
}
