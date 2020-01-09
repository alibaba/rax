import isFunction from './isFunction';
import {
  ON_SHOW,
  ON_HIDE,
  ON_PAGE_SCROLL,
  ON_SHARE_APP_MESSAGE,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_TAB_ITEM_TAP,
  ON_TITLE_CLICK
} from './cycles';
import { useEffect } from './hooks';
import { getMiniAppHistory } from './history';
import { getPageInstance } from './pageInstanceMap';


const history = getMiniAppHistory();

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
    case ON_TITLE_CLICK:
      const pageId = history && history.location._pageId;
      useEffect(() => {
        if (isFunction(callback)) {
          if (!cycles[pageId]) {
            cycles[pageId] = {};
          }
          if (!cycles[pageId][cycle]) {
            cycles[pageId][cycle] = [];
          }
          if (cycle === ON_SHARE_APP_MESSAGE && cycles[pageId][cycle].length > 1) {
            console.warn('useShareAppMessage can only receive one callback function.');
          } else {
            cycles[pageId][cycle].push(callback);
          }
        }

        const pageInstance = getPageInstance(pageId);
        if (!pageInstance._internal[cycle]) {
          if (cycle === ON_SHOW || cycle === ON_HIDE) {
            pageInstance._internal[cycle] = () => {
              if (pageInstance.__mounted) {
                pageInstance._trigger(cycle);
              }
            };
          } else {
            pageInstance._internal[cycle] = (e) => {
              return pageInstance._trigger(cycle, e);
            };
          }
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
  console.warn('useShareAppMessage() will be deprecated soon, please use usePageShare() instead.');
  return usePageEffect(ON_SHARE_APP_MESSAGE, callback);
}

export function usePageShare(callback) {
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

export function useTitleClick(callback) {
  return usePageEffect(ON_TITLE_CLICK, callback);
}
