import EventTarget from './event/event-target';
import OriginalCustomEvent from './event/custom-event';
import tool from './util/tool';
import cache from './util/cache';
import Node from './node/node';
import Element from './node/element';
import Event from './event/event';
import Document from './document';
import TextNode from './node/text-node';
import Comment from './node/comment';
import ClassList from './node/class-list';
import Style from './node/style';
import Attribute from './node/attribute';

let lastRafTime = 0;
const WINDOW_PROTOTYPE_MAP = {
  event: Event.prototype,
};
const ELEMENT_PROTOTYPE_MAP = {
  attribute: Attribute.prototype,
  classList: ClassList.prototype,
  style: Style.prototype,
};

class Window extends EventTarget {
  constructor(pageId) {
    super();

    const timeOrigin = +new Date();

    this.$_pageId = pageId;

    this.$_elementConstructor = function HTMLElement(...args) {
      return Element.$$create(...args);
    };
    this.$_customEventConstructor = class CustomEvent extends OriginalCustomEvent {
      constructor(name = '', options = {}) {
        options.timeStamp = +new Date() - timeOrigin;
        super(name, options);
      }
    };

    // React environment compatibility
    this.HTMLIFrameElement = function() {};
  }

  // Pull handles the necessary information for the section
  $_getAspectInfo(descriptor) {
    if (!descriptor || typeof descriptor !== 'string') return;

    descriptor = descriptor.split('.');
    const main = descriptor[0];
    const sub = descriptor[1];
    let method = descriptor[1];
    let type = descriptor[2];
    let prototype;

    // Find object prototypes
    if (main === 'window') {
      if (WINDOW_PROTOTYPE_MAP[sub]) {
        prototype = WINDOW_PROTOTYPE_MAP[sub];
        method = type;
        type = descriptor[3];
      } else {
        prototype = Window.prototype;
      }
    } else if (main === 'document') {
      prototype = Document.prototype;
    } else if (main === 'element') {
      if (ELEMENT_PROTOTYPE_MAP[sub]) {
        prototype = ELEMENT_PROTOTYPE_MAP[sub];
        method = type;
        type = descriptor[3];
      } else {
        prototype = Element.prototype;
      }
    } else if (main === 'textNode') {
      prototype = TextNode.prototype;
    } else if (main === 'comment') {
      prototype = Comment.prototype;
    }

    return {prototype, method, type};
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

  $$getPrototype(descriptor) {
    if (!descriptor || typeof descriptor !== 'string') return;

    descriptor = descriptor.split('.');
    const main = descriptor[0];
    const sub = descriptor[1];

    if (main === 'window') {
      if (WINDOW_PROTOTYPE_MAP[sub]) {
        return WINDOW_PROTOTYPE_MAP[sub];
      } else if (!sub) {
        return Window.prototype;
      }
    } else if (main === 'document') {
      if (!sub) {
        return Document.prototype;
      }
    } else if (main === 'element') {
      if (ELEMENT_PROTOTYPE_MAP[sub]) {
        return ELEMENT_PROTOTYPE_MAP[sub];
      } else if (!sub) {
        return Element.prototype;
      }
    } else if (main === 'textNode') {
      if (!sub) {
        return TextNode.prototype;
      }
    } else if (main === 'comment') {
      if (!sub) {
        return Comment.prototype;
      }
    }
  }

  // Extend bom & dom
  $$extend(descriptor, options) {
    if (!descriptor || !options || typeof descriptor !== 'string' || typeof options !== 'object') return;

    const prototype = this.$$getPrototype(descriptor);
    const keys = Object.keys(options);

    if (prototype) keys.forEach(key => prototype[key] = options[key]);
  }

  // Appends the section method to the dom/bom object method
  $$addAspect(descriptor, func) {
    if (!descriptor || !func || typeof descriptor !== 'string' || typeof func !== 'function') return;

    const {prototype, method, type} = this.$_getAspectInfo(descriptor);

    // Processing section
    if (prototype && method && type) {
      const methodInPrototype = prototype[method];
      if (typeof methodInPrototype !== 'function') return;

      if (!methodInPrototype.$$isHook) {
        prototype[method] = function(...args) {
          const beforeFuncs = prototype[method].$$before || [];
          const afterFuncs = prototype[method].$$after || [];

          if (beforeFuncs.length) {
            for (const beforeFunc of beforeFuncs) {
              const isStop = beforeFunc.apply(this, args);
              if (isStop) return;
            }
          }

          const res = methodInPrototype.apply(this, args);

          if (afterFuncs.length) {
            for (const afterFunc of afterFuncs) {
              afterFunc.call(this, res);
            }
          }

          return res;
        };
        prototype[method].$$isHook = true;
        prototype[method].$$originalMethod = methodInPrototype;
      }

      // Append the section method
      if (type === 'before') {
        prototype[method].$$before = prototype[method].$$before || [];
        prototype[method].$$before.push(func);
      } else if (type === 'after') {
        prototype[method].$$after = prototype[method].$$after || [];
        prototype[method].$$after.push(func);
      }
    }
  }

  // Remove the preprocessing/postprocessing of dom/bom object methods
  $$removeAspect(descriptor, func) {
    if (!descriptor || !func || typeof descriptor !== 'string' || typeof func !== 'function') return;

    const {prototype, method, type} = this.$_getAspectInfo(descriptor);

    if (prototype && method && type) {
      const methodInPrototype = prototype[method];
      if (typeof methodInPrototype !== 'function' || !methodInPrototype.$$isHook) return;

      if (type === 'before' && methodInPrototype.$$before) {
        methodInPrototype.$$before.splice(methodInPrototype.$$before.indexOf(func), 1);
      } else if (type === 'after' && methodInPrototype.$$after) {
        methodInPrototype.$$after.splice(methodInPrototype.$$after.indexOf(func), 1);
      }

      if ((!methodInPrototype.$$before || !methodInPrototype.$$before.length) && (!methodInPrototype.$$after || !methodInPrototype.$$after.length)) {
        prototype[method] = methodInPrototype.$$originalMethod;
      }
    }
  }

  /**
   * External properties and methods
   */
  get document() {
    return cache.getDocument(this.$_pageId) || null;
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

export default Window;
