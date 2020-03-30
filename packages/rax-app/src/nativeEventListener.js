export function registerNativeEventListeners(Klass, events) {
// Wait for distinguish page configuration
}

export function addNativeEventListener(eventName, callback) {
  window.addEventListener(eventName, callback);
}

export function removeNativeEventListener(evetName, callback) {
  window.removeEventListener(evetName, callback);
}
