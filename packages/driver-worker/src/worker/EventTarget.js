import { mutate } from './MutationObserver';
import splice from '../shared/splice';

export default class EventTarget {
  _eventListeners = {};

  _getEvents() {
    const eventKeys = Object.keys(this._eventListeners);
    // Must have at least one handler.
    return eventKeys.filter((eventName) => {
      return this._eventListeners[eventName].length > 0;
    });
  }

  /**
   * Add event listener.
   * @param type {String} Event name.
   * @param handler {EventHandler} Event handler.
   */
  addEventListener(type, handler) {
    type = String(type).toLowerCase();
    (
      this._eventListeners[type] ||
      (this._eventListeners[type] = [])
    ).push(handler);
    mutate(this, 'addEvent', { eventName: type });
  }

  /**
   * Remove event listener.
   * @param type {String} Event name.
   * @param handler {EventHandler} Event handler.
   */
  removeEventListener(type, handler) {
    type = String(type).toLowerCase();
    splice(this._eventListeners[type], handler, 0, true);
    mutate(this, 'removeEvent', { eventName: type });
  }

  /**
   * Dispatch an event to target.
   * @param event {Event} event.
   * @return {boolean}
   */
  dispatchEvent(event) {
    let type = event.type;
    let target = event.target = event.currentTarget = this;

    let listeners;
    let i;
    do {
      listeners = target._eventListeners && target._eventListeners[type];
      if (listeners) {
        for (i = listeners.length; i--;) {
          const handlerResult = listeners[i].call(target, event);
          if (handlerResult === false || event._end) break;
        }
      }
    } while (
      event.bubbles && !event.defaultPrevented &&
      (event.currentTarget = target = target.parentNode)
    );
    return !event.defaultPrevented;
  }
}
