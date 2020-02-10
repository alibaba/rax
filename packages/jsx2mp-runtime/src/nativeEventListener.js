import { getMiniAppHistory } from './history';
import { getPageInstance } from './pageInstanceMap';
import getNativeEventBindTarget from './adapter/getNativeEventBindTarget';

export function registerEventsInConfig(Klass, events = []) {
  const eventBindTarget = getNativeEventBindTarget(Klass);
  if (!Klass.prototype.__nativeEventQueue) {
    Klass.prototype.__nativeEventQueue = {};
  }
  events.forEach(eventName => {
    eventBindTarget[eventName] = function(...args) {
      Klass.prototype.__nativeEventQueue[eventName].forEach(callback => callback(...args));
    };
  });
}

export function registerNativeEventListeners(component, events) {
  component.__nativeEvents = events;
}

export function addNativeEventListener(eventName, callback) {
  const history = getMiniAppHistory();
  const pageId = history.location._pageId;
  const pageInstance = getPageInstance(pageId);
  if (!pageInstance.__proto__.__nativeEventQueue[eventName]) {
    pageInstance.__proto__.__nativeEventQueue[eventName] = [];
  }
  pageInstance.__proto__.__nativeEventQueue[eventName].push(callback);
}
