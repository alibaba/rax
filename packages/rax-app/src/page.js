import { useEffect } from 'rax';
import { getHistory } from './runApp';
import { isWeb, isWeex } from 'universal-env';

const SHOW = 'show';
const HIDE = 'hide';

const visibleListeners = {};
visibleListeners[SHOW] = [];
visibleListeners[HIDE] = [];

let prevVisibleState = true;
let prePathname = '';

function emit(cycle, ...args) {
  for (let i = 0, l = visibleListeners[cycle].length; i < l; i++) {
    visibleListeners[cycle][i](...args);
  }
}

function usePageLifecycle(cycle, callback) {
  switch (cycle) {
    case SHOW:
    case HIDE:
      useEffect(() => {
        if (cycle === SHOW) {
          callback();
        }
        visibleListeners[cycle].push(callback);
        return () => {
          const index = visibleListeners[cycle].indexOf(callback);
          const history = getHistory();
          // When SPA componentWillUnMount call hide
          if (isWeb && cycle === HIDE && history && prePathname !== history.location.pathname) {
            callback();
          }
          prePathname = history.location.pathname;
          visibleListeners[cycle].splice(index, 1);
        };
      }, []);
  }
}

export function usePageShow(callback) {
  usePageLifecycle(SHOW, callback);
}

export function usePageHide(callback) {
  usePageLifecycle(HIDE, callback);
}

if (isWeb) {
  document.addEventListener('visibilitychange', function() {
    const currentVisibleState = document.visibilityState === 'visible';
    if (prevVisibleState !== currentVisibleState) {
      emit(currentVisibleState ? SHOW : HIDE);
    }
    prevVisibleState = currentVisibleState;
  });
} else if (isWeex) {
  // https://weex.apache.org/docs/modules/globalEvent.html#addeventlistener
  const globalEvent = weex.requireModule('globalEvent'); // eslint-disable-line
  globalEvent.addEventListener('WXApplicationDidBecomeActiveEvent', function() {
    emit(SHOW);
  });
  globalEvent.addEventListener('WXApplicationWillResignActiveEvent', function() {
    emit(HIDE);
  });
}
