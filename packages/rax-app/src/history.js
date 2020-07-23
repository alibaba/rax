import { createMemoryHistory, createHashHistory, createBrowserHistory } from 'history';
import { createMiniAppHistory } from 'miniapp-history';
import { INITIAL_DATA_FROM_SSR } from './constants';
import { isMiniAppPlatform, isWeb } from './env';

const initialDataFromSSR = global[INITIAL_DATA_FROM_SSR];

let history;

export function createHistory(routes, userHistory) {
  if (userHistory) {
    history = userHistory;
  } else if (initialDataFromSSR) {
    // If that contains `initialDataFromSSR`, which means SSR is enabled,
    // we should use browser history to make it works.
    history = createBrowserHistory();
  } else if (isWeb) {
    history = createHashHistory();
  } else if (isMiniAppPlatform) {
    window.history = createMiniAppHistory(routes);
    window.location = window.history.location;
    history = window.history;
  } else {
    // In other situation use memory history.
    history = createMemoryHistory();
  }
  return history;
}

export function getHistory() {
  // Currently on MiniApp platform every single js file doesn't share the same runtime
  return isMiniAppPlatform ? window.history : history;
}
