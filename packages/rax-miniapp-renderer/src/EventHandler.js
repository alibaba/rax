import { passive as supportsPassive } from './supports';

const EVENT_OPTIONS = supportsPassive ? { capture: true, passive: true } : true;
const NO_BUBBLES_EVENTS = {
  // Resource Events and Progress Events
  load: true,
  error: true,
  unload: true,
  abort: true,
  loadstart: true,
  progress: true,
  loadend: true,
  // Focus Events
  blur: true,
  focus: true,
  // View Events
  scroll: true, // Not bubles on elements
  appear: true,
  disappear: true,
  // Uncategorized events
  invalid: true
};
const TOUCH_EVENTS = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
const EVENT_LISTENERS = '__event_listeners__';

export default class EventHandler {
  constructor(handler, options = {}) {
    this.postMessage = handler;
    this.registeredEventCounts = {};
    this.nobubbleEventNodes = [];
    this.mountNode = options.mountNode || document;
    this.touch = null;
  }

  addEvent(node, name) {
    if (NO_BUBBLES_EVENTS[name]) {
      this.addNoBubblesEventListener(node, name);
    } else {
      const registeredCount = this.registeredEventCounts[name];
      if (!registeredCount) {
        this.registeredEventCounts[name] = 1;
        // Top-level register
        this.mountNode.addEventListener(name, this.eventProxyHandler, EVENT_OPTIONS);
      } else {
        this.registeredEventCounts[name]++;
      }
    }
  }

  removeAllEvents() {
    // Remove no-bubbles events.
    let noBubblesEventNode;
    while (noBubblesEventNode = this.nobubbleEventNodes.pop()) {
      if (noBubblesEventNode[EVENT_LISTENERS]) {
        const eventNames = Object.keys(noBubblesEventNode[EVENT_LISTENERS]);
        for (let i = 0, l = eventNames.length; i < l; i++) {
          this.removeNoBubblesEventListener(noBubblesEventNode, eventNames[i]);
        }
      }
    }

    // Remove regular events.
    const events = Object.keys(this.registeredEventCounts);
    for (let i = 0, l = events.length; i < l; i++) {
      const name = events[i];
      this.mountNode.removeEventListener(name, this.eventProxyHandler, EVENT_OPTIONS);
      delete this.registeredEventCounts[name];
    }
  }

  removeEvent(node, name) {
    if (NO_BUBBLES_EVENTS[name]) {
      this.removeNoBubblesEventListener(node, name);
    } else {
      this.registeredEventCounts[name]--;
      if (this.registeredEventCounts[name] === 0) {
        this.mountNode.removeEventListener(name, this.eventProxyHandler, EVENT_OPTIONS);
      }
    }
  }

  addNoBubblesEventListener(node, name) {
    const listener = (evt) => {
      const target = {$$id: node.$$id};
      this.postMessage({
        type: 'event',
        event: {
          type: name,
          target,
          currentTarget: target,
          detail: evt.detail
        }
      });
    };
    const listeners = node[EVENT_LISTENERS] = node[EVENT_LISTENERS] || {};
    listeners[name] = listeners[name] || [];
    listeners[name].push(listener);
    if (this.nobubbleEventNodes.indexOf(node) !== -1) this.nobubbleEventNodes.push(node);
    node.addEventListener(name, listener, EVENT_OPTIONS);
  }

  removeNoBubblesEventListener(node, name) {
    if (node[EVENT_LISTENERS] && node[EVENT_LISTENERS][name]) {
      for (let i = 0, l = node[EVENT_LISTENERS][name].length; i < l; i++) {
        node.removeEventListener(name, node[EVENT_LISTENERS][name][i], EVENT_OPTIONS);
      }
      delete node[EVENT_LISTENERS][name];
    }
    this.nobubbleEventNodes.splice(this.nobubbleEventNodes.indexOf(node), 1);
  }

  eventProxyHandler = (e) => {
    if (e.type === 'click' && this.touch) return false;

    let event = { type: e.type };
    if (e.target) event.target = e.target.$$id;
    if (e.type === 'scroll' && e.target === document) {
      event.target = document.body.$$id;
      // page scroll container's top
      // safari is document.body.scrollTop
      // chrome is document.documentElement.scrollTop
      event.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    }
    // CustomEvent detail
    if (e.detail) event.detail = e.detail;
    for (let i in e) {
      let v = e[i];
      if (
        typeof v !== 'object' &&
        typeof v !== 'function' &&
        i !== i.toUpperCase() &&
        !event.hasOwnProperty(i)
      ) {
        event[i] = v;
      }
    }

    if (TOUCH_EVENTS.indexOf(e.type) !== -1) {
      event.touches = serializeTouchList(e.touches);
      event.changedTouches = serializeTouchList(e.changedTouches);
    }

    this.postMessage({
      type: 'event',
      event
    });

    if (e.type === 'touchstart') {
      this.touch = getTouch(e);
    } else if (e.type === 'touchend' && this.touch) {
      let t = getTouch(e);
      if (t) {
        let delta = Math.sqrt(
          Math.pow(t.pageX - this.touch.pageX, 2) +
          Math.pow(t.pageY - this.touch.pageY, 2)
        );
        if (delta < 10) {
          event.type = 'click';
          this.postMessage({ type: 'event', event });
        }
      }
    }
  }
}

function getTouch(e) {
  let t = e.changedTouches && e.changedTouches[0] ||
    e.touches && e.touches[0] || e;
  return t && { pageX: t.pageX, pageY: t.pageY };
}

function serializeTouchList(touchList) {
  const touches = [];
  for (let i = 0, l = touchList.length; i < l; i++) {
    const {
      clientX, clientY,
      pageX, pageY,
      identifier, target
    } = touchList[i];

    touches.push({
      clientX, clientY,
      pageX, pageY,
      identifier,
      // instance id of changed target
      $$id: target.$$id,
    });
  }
  return touches;
}

