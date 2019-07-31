
export default function invokeCycle(cycleMap, cycle, ...args) {
  if (cycleMap.hasOwnProperty(cycle)) {
    const cycles = cycleMap[cycle];
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
