/**
 * Simulate appear & disappear events.
 */
import { createIntersectionObserver, destroyIntersectionObserver, observerElement } from './intersectionObserverManager';

// hijack Node.prototype.addEventListener
const injectEventListenerHook = (instances = [], Node) => {
  let nativeAddEventListener = Node.prototype.addEventListener;

  Node.prototype.addEventListener = function(eventName, eventHandler, useCapture, doNotWatch) {
    const lowerCaseEventName = eventName && String(eventName).toLowerCase();
    const isAppearEvent = lowerCaseEventName === 'appear' || lowerCaseEventName === 'disappear';
    if (isAppearEvent) observerElement(this);

    nativeAddEventListener.call(this, eventName, eventHandler, useCapture);
  };

  return function unsetup() {
    Node.prototype.addEventListener = nativeAddEventListener;
    destroyIntersectionObserver();
  };
};

export function setupAppear(win = window) {
  createIntersectionObserver();
  return injectEventListenerHook([], win.Node);
}

