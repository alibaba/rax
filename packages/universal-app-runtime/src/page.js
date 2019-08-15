import { useEffect } from 'rax';
import { isWeb, isWeex } from 'universal-env';

const visibleListeners = {
  show: [],
  hide: [],
};
let initialShow = false;
let prevVisibleState = true;

export function usePageEffect(cycle, callback) {
  switch (cycle) {
    case 'show':
    case 'hide':
      useEffect(() => {
        visibleListeners[cycle].push(callback);
        return () => {
          const index = visibleListeners[cycle].indexOf(callback);
          visibleListeners[cycle].splice(index, 1);
        };
      });
  }

  // Invoke first time show.
  if (cycle === 'show') {
    if (initialShow === false) {
      initialShow = true;
      useEffect(() => {
        invokeCycle('show');
      });
    }
  }
}

function invokeCycle(cycle, ...args) {
  for (let i = 0, l = visibleListeners[cycle].length; i < l; i++) {
    visibleListeners[cycle][i](...args);
  }
}

if (isWeb) {
  document.addEventListener('visibilitychange', function() {
    const currentVisibleState = document.visibilityState === 'visible';
    if (prevVisibleState !== currentVisibleState) {
      invokeCycle(currentVisibleState ? 'show' : 'hide');
    }
    prevVisibleState = currentVisibleState;
  });
} else if (isWeex) {
  // require('@weex/module')
  // todo support weex.
}
