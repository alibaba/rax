const listeners = {
  // [target]: [cb1, cb2,...]
};

export function addMessageListener(target, callback) {
  if (listeners[target]) {
    listeners[target].push(callback);
  } else {
    listeners[target] = [callback];
  }
}

export function triggerEvent(target, payload) {
  if (listeners[target]) {
    for (let i = 0, l = listeners[target].length; i < l; i++) {
      listeners[target][i](payload);
    }
  }
}

export function removeMessageListener() {
  // todo
}
