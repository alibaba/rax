import isFunction from './isFunction';
import {
  ON_SHOW,
  ON_HIDE,
  ON_PAGE_SCROLL,
  ON_SHARE_APP_MESSAGE,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_TAB_ITEM_TAP
} from './cycles';
import { useEffect } from './hooks';
import { createMiniAppHistory } from './history';

const history = createMiniAppHistory();

export const cycles = {};

export function usePageEffect(cycle, callback) {
  switch (cycle) {
    case ON_SHOW:
    case ON_HIDE:
    case ON_PAGE_SCROLL:
    case ON_SHARE_APP_MESSAGE:
    case ON_REACH_BOTTOM:
    case ON_PULL_DOWN_REFRESH:
    case ON_TAB_ITEM_TAP:
      const pathname = history && history.location.pathname;
      useEffect(() => {
        if (isFunction(callback)) {
          if (!cycles[pathname]) {
            cycles[pathname] = {};
          }
          if (!cycles[pathname][cycle]) {
            cycles[pathname][cycle] = [];
          }
          cycles[pathname][cycle].push(callback);
        }
      }, []);
      break;
    default:
      throw new Error('Unsupported page cycle ' + cycle);
  }
}

export function usePageShow(callback) {
  return usePageEffect(ON_SHOW, callback);
}

export function usePageHide(callback) {
  return usePageEffect(ON_HIDE, callback);
}

export function usePageScroll(callback) {
  return usePageEffect(ON_PAGE_SCROLL, callback);
}

export function useShareAppMessage(callback) {
  return usePageEffect(ON_SHARE_APP_MESSAGE, callback);
}

export function usePageReachBottom(callback) {
  return usePageEffect(ON_REACH_BOTTOM, callback);
}

export function usePagePullDownRefresh(callback) {
  return usePageEffect(ON_PULL_DOWN_REFRESH, callback);
}

export function useTabItemTap(callback) {
  return usePageEffect(ON_TAB_ITEM_TAP, callback);
}
