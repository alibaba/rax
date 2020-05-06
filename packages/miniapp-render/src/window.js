import EventTarget from './event/event-target';
import OriginalCustomEvent from './event/custom-event';
import tool from './util/tool';
import cache from './util/cache';
import Node from './node/node';
import Element from './node/element';

let lastRafTime = 0;
let window;

class Window extends EventTarget {
  constructor() {
    super();

    const timeOrigin = +new Date();

    this.$_elementConstructor = function HTMLElement(...args) {
      return Element.$$create(...args);
    };
    this.$_customEventConstructor = class CustomEvent extends OriginalCustomEvent {
      constructor(name = '', options = {}) {
        options.timeStamp = +new Date() - timeOrigin;
        super(name, options);
      }
    };
  }

  // Forces the setData cache to be emptied
  $$forceRender() {
    tool.flushThrottleCache();
  }

  // Trigger node event
  $$trigger(eventName, options = {}) {
    if (eventName === 'error' && typeof options.event === 'string') {
      const errStack = options.event;
      const errLines = errStack.split('\n');
      let message = '';
      for (let i = 0, len = errLines.length; i < len; i++) {
        const line = errLines[i];
        if (line.trim().indexOf('at') !== 0) {
          message += line + '\n';
        } else {
          break;
        }
      }

      const error = new Error(message);
      error.stack = errStack;
      options.event = new this.$_customEventConstructor('error', {
        target: this,
        $$extra: {
          message,
          filename: '',
          lineno: 0,
          colno: 0,
          error,
        },
      });
      options.args = [message, error];

      if (typeof this.onerror === 'function' && !this.onerror.$$isOfficial) {
        const oldOnError = this.onerror;
        this.onerror = (event, message, error) => {
          oldOnError.call(this, message, '', 0, 0, error);
        };
        this.onerror.$$isOfficial = true;
      }
    }

    super.$$trigger(eventName, options);
  }

  /**
   * External properties and methods
   */
  get document() {
    return cache.getDocument(this.__pageId) || null;
  }

  get CustomEvent() {
    return this.$_customEventConstructor;
  }

  get self() {
    return this;
  }

  get Image() {
    return this.document.$$imageConstructor;
  }

  get setTimeout() {
    return setTimeout.bind(null);
  }

  get clearTimeout() {
    return clearTimeout.bind(null);
  }

  get setInterval() {
    return setInterval.bind(null);
  }

  get clearInterval() {
    return clearInterval.bind(null);
  }

  get HTMLElement() {
    return this.$_elementConstructor;
  }

  get Element() {
    return Element;
  }

  get Node() {
    return Node;
  }

  get RegExp() {
    return RegExp;
  }

  get Math() {
    return Math;
  }

  get Number() {
    return Number;
  }

  get Boolean() {
    return Boolean;
  }

  get String() {
    return String;
  }

  get Date() {
    return Date;
  }

  get Symbol() {
    return Symbol;
  }

  getComputedStyle() {
    // Only for compatible use
    console.warn('window.getComputedStyle is not supported.');
  }

  requestAnimationFrame(callback) {
    if (typeof callback !== 'function') return;

    const now = new Date();
    const nextRafTime = Math.max(lastRafTime + 16, now);
    return setTimeout(() => {
      callback(nextRafTime);
      lastRafTime = nextRafTime;
    }, nextRafTime - now);
  }

  cancelAnimationFrame(timeId) {
    return clearTimeout(timeId);
  }
}

export function createWindow() {
  if (!window) {
    return window = new Window();
  }
  return window;
}

export function getWindow() {
  return window;
}

