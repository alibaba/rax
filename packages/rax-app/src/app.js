export const appCycles = {};

export function emit(cycle, ...args) {
  if (appCycles.hasOwnProperty(cycle)) {
    const cycles = appCycles[cycle];
    let fn;
    let error;
    while (fn = cycles.shift()) { // eslint-disable-line
      try {
        fn(...args);
      } catch (err) {
        error = err;
      }
    }
    if (error) throw error;
  }
}

function useAppLifecycle(cycle, callback) {
  const cycles = appCycles[cycle] = appCycles[cycle] || [];
  cycles.push(callback);
}

export function useAppLaunch(callback) {
  useAppLifecycle('launch', callback);
}
