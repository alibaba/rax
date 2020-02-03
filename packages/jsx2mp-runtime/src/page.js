import isFunction from './isFunction';
import {
  ON_SHOW,
  ON_HIDE,
} from './cycles';
import { useEffect } from './hooks';
import { getMiniAppHistory } from './history';
import { getPageInstanceById } from './pageInstanceMap';

const history = getMiniAppHistory();

export const cycles = {};

export function usePageEffect(cycle, callback) {
  if (isFunction(callback)) {
    switch (cycle) {
      case ON_SHOW:
      case ON_HIDE:
        const pageId = history && history.location._pageId;
        useEffect(() => {
          if (!cycles[pageId]) {
            cycles[pageId] = {};
          }
          if (!cycles[pageId][cycle]) {
            cycles[pageId][cycle] = [];
          }
          cycles[pageId][cycle].push(callback);

          // Define page instance life cycle when the cycle is used
          const pageInstance = getPageInstanceById(pageId);
          if (!pageInstance._internal[cycle]) {
            pageInstance._internal[cycle] = (e) => {
              return pageInstance._trigger(cycle, e);
            };
          }
        }, []);
        break;
      default:
        throw new Error('Unsupported page cycle ' + cycle);
    }
  }
}

export function usePageShow(callback) {
  return usePageEffect(ON_SHOW, callback);
}

export function usePageHide(callback) {
  return usePageEffect(ON_HIDE, callback);
}
