// eslint-disable-next-line import/no-extraneous-dependencies
import { isWeChatMiniProgram, isMiniApp } from 'universal-env';
import Event from './event';
import CustomEvent from './custom-event';

/**
 * Compare touch list
 */
function compareTouchList(a, b) {
  if (a.length !== b.length) return false;

  for (let i, len = a.length; i < len; i++) {
    const aItem = a[i];
    const bItem = b[i];

    if (aItem.identifier !== bItem.identifier) return false;
    if (aItem.pageX !== bItem.pageX || aItem.pageY !== bItem.pageY || aItem.clientX !== bItem.clientX || aItem.clientY !== bItem.clientY) return false;
  }

  return true;
}

/**
 * Compare event detail
 * @param {object} a
 * @param {object} b
 */
function compareDetail(a, b) {
  if (a.pageX === b.pageX && a.pageY === b.pageY && a.clientX === b.clientX && a.clientY === b.clientY) {
    return true;
  }
  return false;
}

/**
 *
 * @param {string} property 'touches' or 'changedTouches' or 'detail'
 * @param {object} last last event
 * @param {object} now current event
 */
function compareEventProperty(property, last, now) {
  const compareFn = property === 'detail' ? compareDetail : compareTouchList;
  if (last[property] && now[property] && !compareFn(last[property], now[property])) {
    // property are different
    return true;
  }
  if (!last[property] && now[property] || last[property] && !now[property]) {
    // One of them  doesn't have property
    return true;
  }
  return false;
}

function compareEventInAlipay(last, now) {
  // In Alipay, timestamps of the same event may have slight differences when bubbling
  // Set the D-value threshold to 10
  if (!last || now.timeStamp - last.timeStamp > 10) {
    return true;
  }
  // Tap event has no touches or changedTouches in Alipay, so use detail property to check
  return compareEventProperty('detail', last, now) || compareEventProperty('touches', last, now) || compareEventProperty('changedTouches', last, now);
}

function compareEventInWechat(last, now) {
  // TimeStamps are different
  if (!last || last.timeStamp !== now.timeStamp) {
    return true;
  }
  return compareEventProperty('touches', last, now) || compareEventProperty('changedTouches', last, now);
}

class EventTarget {
  constructor(...args) {
    this.$$init(...args);
  }

  $$init() {
    // Supplement the instance's properties for the 'XXX' in XXX judgment
    this.ontouchstart = null;
    this.ontouchmove = null;
    this.ontouchend = null;
    this.ontouchcancel = null;
    this.oninput = null;
    this.onfocus = null;
    this.onblur = null;
    this.onchange = null;

    // Logs the triggered miniapp events
    this.$_miniappEvent = null;
    this.$_eventHandlerMap = null;
  }

  // Destroy instance
  $$destroy() {
    Object.keys(this).forEach(key => {
      // Handles properties beginning with on
      if (key.indexOf('on') === 0) this[key] = null;
      // Handles private properties that are hung externally
      if (key[0] === '_') this[key] = null;
      if (key[0] === '$' && (key[1] !== '_' && key[1] !== '$')) this[key] = null;
    });

    this.$_miniappEvent = null;
    this.$_eventHandlerMap = null;
  }

  set $_eventHandlerMap(value) {
    this.$__eventHandlerMap = value;
  }

  get $_eventHandlerMap() {
    if (!this.$__eventHandlerMap) this.$__eventHandlerMap = Object.create(null);
    return this.$__eventHandlerMap;
  }

  // Trigger event capture, bubble flow
  static $$process(target, eventName, miniprogramEvent, extra, callback) {
    let event;

    if (eventName instanceof CustomEvent || eventName instanceof Event) {
      // The event object is passed in
      event = eventName;
      eventName = event.type;
    }

    eventName = eventName.toLowerCase();

    const path = [target];
    let parentNode = target.parentNode;

    while (parentNode && parentNode.tagName !== 'HTML') {
      path.push(parentNode);
      parentNode = parentNode.parentNode;
    }

    if (path[path.length - 1].tagName === 'BODY') {
      // If the last node is document.body, the document.documentelement is appended
      path.push(parentNode);
    }

    if (!event) {
      // Special handling here, not directly return the applet's event object
      event = new Event({
        name: eventName,
        target,
        detail: miniprogramEvent.detail,
        timeStamp: miniprogramEvent.timeStamp,
        touches: miniprogramEvent.touches,
        changedTouches: miniprogramEvent.changedTouches,
        bubbles: true,
        $$extra: extra,
      });
    }

    // Capture
    for (let i = path.length - 1; i >= 0; i--) {
      const currentTarget = path[i];

      // Determine if the bubble is over
      if (!event.$$canBubble) break;
      if (currentTarget === target) continue;

      event.$$setCurrentTarget(currentTarget);
      event.$$setEventPhase(Event.CAPTURING_PHASE);

      currentTarget.$$trigger(eventName, {
        event,
        isCapture: true,
      });
      if (callback) callback(currentTarget, event, true);
    }

    if (event.$$canBubble) {
      event.$$setCurrentTarget(target);
      event.$$setEventPhase(Event.AT_TARGET);

      // Both capture and bubble phase listening events are triggered
      target.$$trigger(eventName, {
        event,
        isCapture: true,
        isTarget: true
      });
      if (callback) callback(target, event, true);

      target.$$trigger(eventName, {
        event,
        isCapture: false,
        isTarget: true
      });
      if (callback) callback(target, event, false);
    }

    if (event.bubbles) {
      for (const currentTarget of path) {
        // Determine if the bubble is over
        if (!event.$$canBubble) break;
        if (currentTarget === target) continue;

        event.$$setCurrentTarget(currentTarget);
        event.$$setEventPhase(Event.BUBBLING_PHASE);

        currentTarget.$$trigger(eventName, {
          event,
          isCapture: false,
        });
        if (callback) callback(currentTarget, event, false);
      }
    }

    // Reset event
    event.$$setCurrentTarget(null);
    event.$$setEventPhase(Event.NONE);

    return event;
  }

  // Get handlers
  __getHandles(eventName, isCapture, isInit) {
    const handlerMap = this.$_eventHandlerMap;
    const pageId = this.__pageId || 'app';
    if (!handlerMap[pageId]) {
      handlerMap[pageId] = {};
    }
    if (isInit) {
      const handlerObj = handlerMap[pageId][eventName] = handlerMap[pageId][eventName] || {};

      handlerObj.capture = handlerObj.capture || [];
      handlerObj.bubble = handlerObj.bubble || [];

      return isCapture ? handlerObj.capture : handlerObj.bubble;
    } else {
      const handlerObj = handlerMap[pageId][eventName];

      if (!handlerObj) return null;

      return isCapture ? handlerObj.capture : handlerObj.bubble;
    }
  }

  // Trigger node event
  $$trigger(eventName, { event, args = [], isCapture, isTarget } = {}) {
    eventName = eventName.toLowerCase();
    const handlers = this.__getHandles(eventName, isCapture);
    const onEventName = `on${eventName}`;

    if ((!isCapture || !isTarget) && typeof this[onEventName] === 'function') {
      // The event that triggers the onXXX binding
      if (event && event.$$immediateStop) return;
      try {
        this[onEventName].call(this || null, event, ...args);
      } catch (err) {
        console.error(err);
      }
    }

    if (handlers && handlers.length) {
      // Trigger addEventListener binded events
      handlers.forEach(handler => {
        if (event && event.$$immediateStop) return;
        try {
          handler.call(this || null, event, ...args);
        } catch (err) {
          console.error(err);
        }
      });
    }
  }

  // Check if the event can be triggered
  $$checkEvent(miniprogramEvent) {
    const last = this.$_miniappEvent;
    const now = miniprogramEvent;

    let flag = false;

    if (isMiniApp) {
      flag = compareEventInAlipay(last, now);
    } else if (isWeChatMiniProgram) {
      flag = compareEventInWechat(last, now);
    }

    if (flag) this.$_miniappEvent = now;
    return flag;
  }

  // Empty all handles to an event
  $$clearEvent(eventName, isCapture = false) {
    if (typeof eventName !== 'string') return;

    eventName = eventName.toLowerCase();
    const handlers = this.__getHandles(eventName, isCapture);

    if (handlers && handlers.length) handlers.length = 0;
  }

  addEventListener(eventName, handler, options) {
    if (typeof eventName !== 'string' || typeof handler !== 'function') return;

    let isCapture = false;

    if (typeof options === 'boolean') isCapture = options;
    else if (typeof options === 'object') isCapture = options.capture;

    eventName = eventName.toLowerCase();
    const handlers = this.__getHandles(eventName, isCapture, true);

    handlers.push(handler);
  }

  removeEventListener(eventName, handler, isCapture = false) {
    if (typeof eventName !== 'string' || typeof handler !== 'function') return;

    eventName = eventName.toLowerCase();
    const handlers = this.__getHandles(eventName, isCapture);

    if (handlers && handlers.length) handlers.splice(handlers.indexOf(handler), 1);
  }

  dispatchEvent(evt) {
    if (evt instanceof CustomEvent) {
      EventTarget.$$process(this, evt);
    }

    // preventDefault is not supported, so it always returns true
    return true;
  }
}

export default EventTarget;
