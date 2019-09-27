import isFunction from './isFunction';

const SHOW = 'show';
const HIDE = 'hide';

export const cycles = {
  [SHOW]: [],
  [HIDE]: [],
};

export function usePageEffect(cycle, callback) {
  switch (cycle) {
    case SHOW:
    case HIDE:
      if (isFunction(callback)) {
        cycles[cycle].push(callback);
      }
      break;
    default:
      throw new Error('Unsupported page cycle ' + cycle);
  }
}

export function usePageShow(callback) {
  return usePageEffect(SHOW, callback);
}

export function usePageHide(callback) {
  return usePageEffect(HIDE, callback);
}
