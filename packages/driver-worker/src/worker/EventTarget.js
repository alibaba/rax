import { mutate } from './MutationObserver';
import splice from '../shared/splice';

export default class EventTarget {
  _eventListeners = {};

  _getEvents() {
    return Object.keys(this._eventListeners);
  }

  addEventListener(type, handler) {
    type = String(type).toLowerCase();
    (
      this._eventListeners[type] ||
      (this._eventListeners[type] = [])
    ).push(handler);
    mutate(this, 'addEvent', { eventName: type });
  }

  removeEventListener(type, handler) {
    type = String(type).toLowerCase();
    splice(this._eventListeners[type], handler, 0, true);
    mutate(this, 'removeEvent', { eventName: type });
  }

  dispatchEvent(event) {
    event.stopPropagation = () => {
      event.bubbles = false;
    };

    let type = event.type.toLowerCase();
    let target = event.target = event.currentTarget = this;
    let cancelable = event.cancelable;

    let listeners;
    let i;
    do {
      listeners = target._eventListeners && target._eventListeners[type];
      if (listeners)
        for (i = listeners.length; i--;) {
          if ((listeners[i].call(target, event) === false || event._end) && cancelable) break;
        }
    } while (
      event.bubbles &&
      !(cancelable && event._stop) &&
      (event.currentTarget = target = target.parentNode)
    );
    return !event.defaultPrevented;
  }
}
