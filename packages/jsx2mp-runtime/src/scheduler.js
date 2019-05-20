let updateCallbacks = [];
let effectCallbacks = [];
let scheduler = setTimeout;

if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  // Wrapper timer for hijack timers in jest
  scheduler = (callback) => {
    setTimeout(callback, 0);
  };
}

// Schedule before next render
export function schedule(callback) {
  if (updateCallbacks.length === 0) {
    scheduler(flush);
  }
  updateCallbacks.push(callback);
}

// Flush before next render
export function flush() {
  let callbacks = updateCallbacks;
  if (callbacks.length !== 0) {
    updateCallbacks = [];
    callbacks.forEach(callback => callback());
  }
}

export function scheduleEffect(callback) {
  if (effectCallbacks.length === 0) {
    scheduler(invokeEffects);
  }
  effectCallbacks.push(callback);
}

export function invokeEffects() {
  let callbacks = effectCallbacks;
  if (callbacks.length !== 0) {
    effectCallbacks = [];
    callbacks.forEach(callback => callback());
  }
}
