let performUpdate = null;

const setImmediatePolyfill = job => {
  return setTimeout(job, 0);
}; // 0s

const scheduleImmediateCallback = typeof setImmediate === 'undefined' ?
  setImmediatePolyfill : setImmediate;

const cancelImmediateCallback = typeof clearImmediate === 'undefined' ?
  clearTimeout : clearImmediate;

let beforeNextRenderCallbacks = [];
let beforeNextRenderCallbackId;

// Commit before next render
function commit() {
  let preCallbacks = beforeNextRenderCallbacks;
  beforeNextRenderCallbacks = [];
  preCallbacks.forEach(callback => callback());
  preCallbacks = null;
  // Exec callback maybe schedule a work
  performUpdate();
}

// Schedule before next render
export const schedule = (callback) => {
  if (beforeNextRenderCallbacks.length === 0) {
    beforeNextRenderCallbackId = scheduleImmediateCallback(commit);
  }
  beforeNextRenderCallbacks.push(callback);
};

// Flush before next render
export function flush() {
  if (beforeNextRenderCallbacks.length !== 0) {
    cancelImmediateCallback(beforeNextRenderCallbackId);
    commit();
  }
}

export function setUpdater(handle) {
  performUpdate = handle;
}