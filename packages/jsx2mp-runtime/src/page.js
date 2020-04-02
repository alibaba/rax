// eslint-disable-next-line import/no-extraneous-dependencies
import { isQuickApp } from 'universal-env';
import { isFunction } from './types';
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
  const history = getMiniAppHistory();

  if (isFunction(callback)) {
    switch (cycle) {
      case ON_SHOW:
      case ON_HIDE:
        // ON_SHOW is before than Component init
        if (isQuickApp && cycle === ON_SHOW) {
          return callback();
        }
        useEffect(() => {
          const pageId = history && history.location._pageId;
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
