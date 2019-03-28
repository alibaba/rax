let scheduler;
if (process.env.NODE_ENV !== 'production') {
  // For jest hijack timers
  scheduler = (callback) => {
    setTimeout(callback);
  };
} else {
  scheduler = typeof Promise == 'function' ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout;
}

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
  let callbacks = updateCallbacks;
  if (callbacks.length !== 0) {
    updateCallbacks = [];
    callbacks.forEach(callback => callback());
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
