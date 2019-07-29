const listeners = {};

export function on(evtName, callback) {
  (listeners[evtName] = listeners[evtName] || []).push(callback);
}

export function emit(evtName, ...args) {
  (listeners[evtName] = listeners[evtName] || []).forEach(callback => {
    callback(...args);
  });
}
