const listeners = {};

export function $on(evtName, callback) {
  (listeners[evtName] = listeners[evtName] || []).push(callback);
}

export function $emit(evtName, message) {
  (listeners[evtName] = listeners[evtName] || []).forEach(callback => {
    callback(message);
  });
}

export function $off(evtName, callback) {
  if (Array.isArray(listeners[evtName])) {
    const idx = listeners[evtName];
    if (idx !== -1) {
      listeners[evtName].splice(idx, 1);
    }
  }
}
