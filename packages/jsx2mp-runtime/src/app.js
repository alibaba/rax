import {
  ON_SHOW,
  ON_HIDE,
  ON_ERROR,
  ON_SHARE_APP_MESSAGE,
  ON_LAUNCH
} from './cycles';

export const cycles = {};

export function useAppEffect(cycle, callback) {
  switch (cycle) {
    case ON_LAUNCH:
    case ON_SHOW:
    case ON_HIDE:
    case ON_ERROR:
      cycles[cycle] = cycles[cycle] || [];
      cycles[cycle].push(callback);
      break;
    case ON_SHARE_APP_MESSAGE:
      cycles[cycle] = cycles[cycle] || [];
      if (cycles[cycle].length > 1) {
        console.warn('useAppShare can only receive one callback function.');
      } else {
        cycles[cycle].push(callback);
      }
      break;
    default:
      throw new Error('Unsupported app cycle ' + cycle);
  }
}

export function useAppLaunch(callback) {
  return useAppEffect(ON_LAUNCH, callback);
}

export function useAppShare(callback) {
  return useAppEffect(ON_SHARE_APP_MESSAGE, callback);
}

export function useAppShow(callback) {
  return useAppEffect(ON_SHOW, callback);
}

export function useAppHide(callback) {
  return useAppEffect(ON_HIDE, callback);
}

export function useAppError(callback) {
  return useAppEffect(ON_ERROR, callback);
}
