import { useEffect } from 'rax';
import { getHistory } from './runApp';
import { isWeb, isWeex } from 'universal-env';

const visibleListeners = {
  show: [],
  hide: [],
};
let prevVisibleState = true;
let prePathname = '';

function emit(cycle, ...args) {
  for (let i = 0, l = visibleListeners[cycle].length; i < l; i++) {
    visibleListeners[cycle][i](...args);
  }
}

function usePageLifecycle(cycle, callback) {
  switch (cycle) {
    case 'show':
    case 'hide':
      useEffect(() => {
        if (cycle === 'show') {
          callback();
        }
        visibleListeners[cycle].push(callback);
        return () => {
          const index = visibleListeners[cycle].indexOf(callback);
          const history = getHistory();
          // When SPA componentWillUnMount call hide
          if (isWeb && cycle === 'hide' && history && prePathname !== history.location.pathname) {
            prePathname = history.location.pathname;
            callback();
          }
          visibleListeners[cycle].splice(index, 1);
        };
      }, []);
  }
}

export function usePageShow(callback) {
  usePageLifecycle('show', callback);
}

export function usePageHide(callback) {
  usePageLifecycle('hide', callback);
}

if (isWeb) {
  document.addEventListener('visibilitychange', function() {
    const currentVisibleState = document.visibilityState === 'visible';
    if (prevVisibleState !== currentVisibleState) {
      emit(currentVisibleState ? 'show' : 'hide');
    }
    prevVisibleState = currentVisibleState;
  });
} else if (isWeex) {
  // TODO: support weex
  // require('@weex/module')
}
