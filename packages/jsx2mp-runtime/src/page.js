import isFunction from './isFunction';

export const cycles = {
  show: [],
  hide: [],
};

// TODO: get current rendering page.
export function usePageEffect(cycle, callback) {
  switch (cycle) {
    case 'show':
    case 'hide':
      if (isFunction(callback)) {
        cycles[cycle].push(callback);
      }
      break;
    default:
      throw new Error('Unsupported cycle name ' + cycle);
  }
}
