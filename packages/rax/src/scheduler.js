const setImmediatePolyfill = job => setTimeout(job, 0); // 0s
const scheduleImmediateCallback = (callback) => {
  const setImmediate = typeof setImmediate === 'undefined' ? setImmediatePolyfill : setImmediate;
  setImmediate(callback);
}

const requestIdleCallbackPolyfill = job => setTimeout(job, 99); // 99ms
const scheduleIdleCallback = (callback) => {
  const requestIdleCallback = typeof requestIdleCallback === 'undefined' ? requestIdleCallbackPolyfill : requestIdleCallback;
  requestIdleCallback(callback);
}

export {
  scheduleImmediateCallback,
  scheduleIdleCallback
};