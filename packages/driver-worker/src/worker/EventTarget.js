import { mutation } from './MutationObserver';
import toLower from '../shared/toLower';
import splice from '../shared/splice';

export default class EventTarget {
  _eventListeners = {};

  addEventListener(type, handler) {
    (
      this._eventListeners[toLower(type)] ||
      (this._eventListeners[toLower(type)] = [])
    ).push(handler);
    mutation(this, 'addEvent', { eventName: type });
  }

  removeEventListener(type, handler) {
    splice(this._eventListeners[toLower(type)], handler, 0, true);
    mutation(this, 'removeEvent', { eventName: type });
  }

  dispatchEvent(event) {
    event.stopPropagation = () => {
      event.bubbles = false;
    };
    let t = event.target = event.currentTarget = this;
    let c = event.cancelable;
    let l;
    let i;
    do {
      l = t._eventListeners && t._eventListeners[toLower(event.type)];
      if (l)
        for (i = l.length; i--;) {
          if ((l[i].call(t, event) === false || event._end) && c) break;
        }
    } while (
      event.bubbles &&
      !(c && event._stop) &&
      (event.currentTarget = t = t.parentNode)
    );
    return !event.defaultPrevented;
  }
}
