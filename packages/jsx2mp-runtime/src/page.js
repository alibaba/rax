import isFunction from './isFunction';
import { ON_SHOW, ON_HIDE } from './cycles';

export const cycles = {
  [ON_SHOW]: [],
  [ON_HIDE]: [],
};

export function usePageEffect(cycle, callback) {
  switch (cycle) {
    case ON_SHOW:
    case ON_HIDE:
      if (isFunction(callback)) {
        cycles[cycle].push(callback);
      }
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
