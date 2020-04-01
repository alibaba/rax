import { getMiniAppHistory } from './history';
import { getPageInstanceById } from './pageInstanceMap';
import getNativeEventBindTarget from './adapter/getNativeEventBindTarget';
import { ON_SHARE_APP_MESSAGE } from './cycles';

export function registerEventsInConfig(Klass, events = []) {
  if (!Klass.prototype.__nativeEventMap) {
    Klass.prototype.__nativeEventMap = {};
  }
  events.forEach(eventName => {
    const shouldReturnConfig = eventName === ON_SHARE_APP_MESSAGE;
    const eventBindTarget = getNativeEventBindTarget(Klass, shouldReturnConfig);
    eventBindTarget[eventName] = function(...args) {
      // onShareAppMessage need receive callback execute return
      let ret;
      if (Klass.prototype.__nativeEventMap[eventName]) {
        Klass.prototype.__nativeEventMap[eventName].forEach(callback => ret = callback(...args));
      }
      return ret;
    };
  });
}

export function registerNativeEventListeners(component, events) {
  component.__nativeEvents = events;
  return component;
}

export function addNativeEventListener(eventName, callback) {
  const pageInstance = getPageInstance();
  if (!pageInstance.__proto__.__nativeEventMap[eventName]) {
    pageInstance.__proto__.__nativeEventMap[eventName] = [];
  }
  pageInstance.__proto__.__nativeEventMap[eventName].push(callback);
}

export function removeNativeEventListener(eventName, callback) {
  const pageInstance = getPageInstance();
  if (pageInstance.__proto__.__nativeEventMap[eventName]) {
    pageInstance.__proto__.__nativeEventMap[eventName] = pageInstance.__proto__.__nativeEventMap[eventName].filter(fn => fn !== callback);
  }
}

function getPageInstance() {
  const history = getMiniAppHistory();
  const pageId = history.location._pageId;
  return getPageInstanceById(pageId);
}
