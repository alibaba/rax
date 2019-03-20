let scheduler;
if (process.env.NODE_ENV !== 'production') {
  scheduler = (callback) => {
    setTimeout(callback);
  };
} else {
  scheduler = typeof Promise == 'function' ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout;
}

let performUpdate = null;
let updateCallbacks = [];
let effectCallbacks = [];

// Schedule before next render
export function schedule(callback) {
  if (updateCallbacks.length === 0) {
    scheduler(flush);
  }
  updateCallbacks.push(callback);
}

// Flush before next render
export function flush() {
  flushEffect();
  let callbacks = updateCallbacks;
  if (callbacks.length !== 0) {
    updateCallbacks = [];
    callbacks.forEach(callback => callback());
    // Exec callback maybe schedule a work
    performUpdate();
  }
}

export function scheduleEffect(callback) {
  if (effectCallbacks.length === 0) {
    scheduler(flushEffect);
  }
  effectCallbacks.push(callback);
}

export function flushEffect() {
  let callbacks = effectCallbacks;
  if (callbacks.length !== 0) {
    effectCallbacks = [];
    callbacks.forEach(callback => callback());
  }
}

export function setUpdater(handle) {
  performUpdate = handle;
}