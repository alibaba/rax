let performWork = null;

const setImmediatePolyfill = job => {
  return setTimeout(job, 0);
}; // 0s

const scheduleImmediateCallback = typeof setImmediate === 'undefined' ?
  setImmediatePolyfill : setImmediate;

const cancelImmediateCallback = typeof clearImmediate === 'undefined' ?
  clearTimeout : clearImmediate;

let beforeNextRenderCallbacks = [];
let beforeNextRenderCallbackId;

export const scheduleBeforeNextRenderCallback = (callback) => {
  if (beforeNextRenderCallbacks.length === 0) {
    beforeNextRenderCallbackId = scheduleImmediateCallback(commitBeforeNextRenderCallbacks);
  }
  beforeNextRenderCallbacks.push(callback);
};

function commitBeforeNextRenderCallbacks() {
  let preCallbacks = beforeNextRenderCallbacks;
  beforeNextRenderCallbacks = [];
  preCallbacks.forEach(callback => callback());
  preCallbacks = null;
  // exec callback maybe schedule a work
  performWork();
}

export function flushBeforeNextRenderCallbacks() {
  if (beforeNextRenderCallbacks.length !== 0) {
    cancelImmediateCallback(beforeNextRenderCallbackId);
    commitBeforeNextRenderCallbacks();
  }
}

export function setPerformWork(handle) {
  performWork = handle;
}