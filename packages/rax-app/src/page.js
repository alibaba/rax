import { useEffect } from 'rax';
import { getHistory } from './history';
import { isMiniAppPlatform, isWeb } from './env';
import { SHOW, HIDE, DEFAULT_PATH_NAME } from './constants';
import { isUndef } from './type';

let listeningDocumentState = false;
// visibleListeners => { [pathname]: { show: [], hide: [] } }
const visibleListeners = {};

function addPageLifeCycle(cycle, callback) {
  const history = getHistory();
  let pathname = DEFAULT_PATH_NAME;
  if (history) {
    pathname = history.location.pathname;
  } else if (isWeb && !isUndef(document) && !listeningDocumentState) {
    // In Web mutiple page, user not execute runApp method, so there should listen visibilitychange
    listeningDocumentState = true;
    document.addEventListener('visibilitychange', function() {
      emit(document.visibilityState === 'visible' ? SHOW : HIDE, pathname);
    });
  }
  if (!visibleListeners[pathname]) {
    visibleListeners[pathname] = {
      [SHOW]: [],
      [HIDE]: []
    };
  }
  visibleListeners[pathname][cycle].push(callback);
}

export function emit(cycle, pathname, ...args) {
  // Ensure queue exists
  if (visibleListeners[pathname] && visibleListeners[pathname][cycle]) {
    for (let i = 0, l = visibleListeners[pathname][cycle].length; i < l; i++) {
      visibleListeners[pathname][cycle][i](...args);
    }
  }
}

function usePageLifeCycle(cycle, callback) {
  useEffect(() => {
    // When component did mount, it will trigger usePageShow callback
    if (cycle === SHOW) {
      callback();
    }
    let pathname = DEFAULT_PATH_NAME;
    const history = getHistory();
    if (history) {
      pathname = history.location.pathname;
    }
    addPageLifeCycle(cycle, callback);

    return () => {
      if (visibleListeners[pathname]) {
        const index = visibleListeners[pathname][cycle].indexOf(callback);
        if (index > -1) {
          visibleListeners[pathname][cycle].splice(index, 1);
        }
      }
    };
  }, []);
}

export function usePageShow(callback) {
  usePageLifeCycle(SHOW, callback);
}

export function usePageHide(callback) {
  usePageLifeCycle(HIDE, callback);
}

export function withPageLifeCycle(Component) {
  class Wrapper extends Component {
    constructor() {
      super();
      if (this.onShow) {
        if (!isMiniAppPlatform) {
          // In MiniApp platform show event will trigger after addPageLifeCycle, so it needn't be execute in constructor
          this.onShow();
        }
        addPageLifeCycle(SHOW, this.onShow.bind(this));
      }
      if (this.onHide) {
        addPageLifeCycle(HIDE, this.onHide.bind(this));
      }
      const history = getHistory();
      // Keep the path name corresponding to current page component
      this.pathname = history ? history.location.pathname : DEFAULT_PATH_NAME;
    }
    componentWillUnmount() {
      visibleListeners[this.pathname] = null;
    }
  }
  Wrapper.displayName = 'withPageLifeCycle(' + (Component.displayName || Component.name) + ')';
  return Wrapper;
}

if (isMiniAppPlatform) {
  window.addEventListener('pageshow', () => {
    // Get history
    const history = getHistory();
    emit(SHOW, history.location.pathname);
  });
  window.addEventListener('pagehide', () => {
    // Get history
    const history = getHistory();
    emit(HIDE, history.location.pathname);
  });
}
