const setImmediatePolyfill = job => {
  return setTimeout(job, 0);
}; // 0s
const scheduleImmediateCallback = typeof setImmediate !== 'undefined' ? setImmediatePolyfill : setImmediate;

const cancelImmediateCallback = typeof clearImmediate !== 'undefined' ? clearTimeout : clearImmediate;

const requestIdleCallbackPolyfill = job => setTimeout(job, 99); // 99ms
const scheduleIdleCallback = typeof requestIdleCallback === 'undefined' ? requestIdleCallbackPolyfill : requestIdleCallback;

let beforeNextRenderCallbacks = [];
let beforeNextRenderCallbackId;
const scheduleBeforeNextRenderCallback = (callback, unique) => {
  if (beforeNextRenderCallbacks.length === 0) {
    beforeNextRenderCallbackId = scheduleImmediateCallback(flushNextRenderCallbacks);
  }
  if (!unique || beforeNextRenderCallbacks.indexOf(callback) < 0) {
    beforeNextRenderCallbacks.push(callback);
  }
};

function flushNextRenderCallbacks() {
  let preCallbacks = beforeNextRenderCallbacks;
  beforeNextRenderCallbacks = [];
  preCallbacks.forEach(callback => callback());
  preCallbacks = null;
}

function flushPassiveEffects() {
  if (beforeNextRenderCallbacks.length !== 0) {
    cancelImmediateCallback(beforeNextRenderCallbackId);
    flushNextRenderCallbacks();
  }
}

export {
  scheduleImmediateCallback,
  scheduleIdleCallback,
  scheduleBeforeNextRenderCallback,
  flushPassiveEffects
};