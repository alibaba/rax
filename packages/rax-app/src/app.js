import { isMiniAppPlatform, isWeex } from './env';
import { SHOW, HIDE, ERROR, LAUNCH, NOT_FOUND, SHARE, TAB_ITEM_CLICK, DEFAULT_PATH_NAME } from './constants';
import { isFunction } from './type';
import { getHistory } from './history';
import router from './router';
import { emit as pageEmit } from './page';

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
    if (cycle === SHARE) {
      // In MiniApp, it need return callback result as share info, like { title, desc, path }
      args[0].content = context ? cycles[0].call(context, args[1]) : cycles[0](args[1]);
    } else {
      cycles.forEach(cycle => {
        context ? cycle.apply(context, args) : cycle(...args);
      });
    }
  }
}

/**
 * Add app lifecycle callback
 * @param {string} cycle cycle name
 * @param {function} callback cycle callback
 */
export function addAppLifeCycle(cycle, callback) {
  if (isFunction(callback)) {
    const cycles = appCycles[cycle] = appCycles[cycle] || [];
    cycles.push(callback);
  }
}

// All of the following hooks will be removed when the future break change
export function useAppLaunch(callback) {
  addAppLifeCycle(LAUNCH, callback);
}

export function useAppShow(callback) {
  addAppLifeCycle(SHOW, callback);
}

export function useAppHide(callback) {
  addAppLifeCycle(HIDE, callback);
}

export function useAppError(callback) {
  addAppLifeCycle(ERROR, callback);
}

export function usePageNotFound(callback) {
  addAppLifeCycle(NOT_FOUND, callback);
}

export function useAppShare(callback) {
  addAppLifeCycle('appshare', callback);
}

// Emit MiniApp App lifeCycles
if (isMiniAppPlatform) {
  window.addEventListener(LAUNCH, ({ options, context }) => {
    emit(LAUNCH, context, options);
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
  window.addEventListener('tabitemclick', ({ options, context }) => {
    emit(TAB_ITEM_CLICK, context, options);
  });
} else if (isWeex) {
  try {
    // https://weex.apache.org/docs/modules/globalEvent.html#addeventlistener
    // Use __weex_require__ in Rax project.
    const globalEvent = __weex_require__('@weex-module/globalEvent');
    globalEvent.addEventListener('WXApplicationDidBecomeActiveEvent', function() {
      // /index as default pathname
      let pathname = DEFAULT_PATH_NAME;
      if (router.current) {
        router.current.visibiltyState = true;
        pathname = router.current.pathname;
      }
      // Emit app show
      emit(SHOW);
      // Emit page show
      pageEmit(SHOW, pathname);
    });
    globalEvent.addEventListener('WXApplicationWillResignActiveEvent', function() {
      // /index as default pathname
      let pathname = DEFAULT_PATH_NAME;
      if (router.current) {
        router.current.visibiltyState = false;
        pathname = router.current.pathname;
      }
      // Emit app hide
      emit(HIDE);
      // Emit page hide
      pageEmit(HIDE, pathname);
    });
  } catch (err) {
    console.log('@weex-module/globalEvent error: ' + err);
  }
} else if (typeof document !== undefined && typeof window !== undefined) {
  document.addEventListener('visibilitychange', function() {
    // Get history
    const history = getHistory();
    // The app switches from foreground to background
    if (router.current && history.location.pathname === router.current.pathname) {
      router.current.visibiltyState = !router.current.visibiltyState;
      if (router.current.visibiltyState) {
        // Emit app show
        emit(SHOW);
        // Emit page show
        pageEmit(SHOW, router.current.pathname);
      } else {
        // Emit app hide
        emit(HIDE);
        // Emit page hide
        pageEmit(HIDE, router.current.pathname);
      }
    }
  });
  // Emit error lifeCycles
  window.addEventListener('error', event => {
    emit(ERROR, null, event.error);
  });
}
