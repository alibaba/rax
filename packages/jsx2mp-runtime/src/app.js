const LAUNCH = 'launch';

export const cycles = {};

export function useAppEffect(cycle, callback) {
  switch (cycle) {
    case LAUNCH:
      cycles[cycle] = cycles[cycle] || [];
      cycles[cycle].push(callback);
      break;
  }
}

export function useAppLaunch(callback) {
  return useAppEffect(LAUNCH, callback);
}
