import { performWork } from './updater';

const setImmediatePolyfill = job => {
  return setTimeout(job, 0);
}; // 0s

const scheduleImmediateCallback = typeof setImmediate === 'undefined' ?
  setImmediatePolyfill : setImmediate;

const cancelImmediateCallback = typeof clearImmediate === 'undefined' ?
  clearTimeout : clearImmediate;

const requestIdleCallbackPolyfill = job => setTimeout(job, 99); // 99ms
const scheduleIdleCallback = typeof requestIdleCallback === 'undefined' ?
  requestIdleCallbackPolyfill : requestIdleCallback;

let beforeNextRenderCallbacks = [];
let beforeNextRenderCallbackId;

const scheduleBeforeNextRenderCallback = (callback) => {
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

function flushBeforeNextRenderCallbacks() {
  if (beforeNextRenderCallbacks.length !== 0) {
    cancelImmediateCallback(beforeNextRenderCallbackId);
    commitBeforeNextRenderCallbacks();
  }
}

export {
  scheduleImmediateCallback,
  scheduleIdleCallback,
  scheduleBeforeNextRenderCallback,
  flushBeforeNextRenderCallbacks
};