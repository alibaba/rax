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

const registeredEventCounts = {};
let sendMessage = () => {};
let touch;

export function setEventSender(handler) {
  sendMessage = handler;
}

export function addEvent(node, name) {
  if (NO_BUBBLES_EVENTS[name]) {
    addNoBubblesEventListener(node, name);
  } else {
    const registeredCount = registeredEventCounts[name];

    if (!registeredCount) {
      registeredEventCounts[name] = 1;
      // Top-level register
      document.addEventListener(name, eventProxyHandler, EVENT_OPTIONS);
    } else {
      registeredEventCounts[name]++;
    }
  }
}

export function removeEvent(node, name) {
  if (NO_BUBBLES_EVENTS[name]) {
    removeNoBubblesEventListener(node, name);
  } else {
    registeredEventCounts[name]--;
    if (registeredEventCounts[name] === 0) {
      document.removeEventListener(name, eventProxyHandler);
    }
  }
}

export function addNoBubblesEventListener(node, name) {
  function listener(evt) {
    const target = {
      $$id: node.$$id
    };
    sendMessage({
      type: 'event',
      event: {
        type: name,
        target,
        currentTarget: target,
        detail: evt.detail
      }
    });
  };
  node[`__$${name}_listener__`] = listener;
  node.addEventListener(name, listener);
}

export function removeNoBubblesEventListener(node, name) {
  const listener = node[`__$${name}_listener__`];
  if (listener) {
    node.removeEventListener(name, listener);
    node[`__$${name}_listener__`] = null;
  }
}

export function eventProxyHandler(e) {
  if (e.type === 'click' && touch) return false;

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

  sendMessage({
    type: 'event',
    event
  });

  if (e.type === 'touchstart') {
    touch = getTouch(e);
  } else if (e.type === 'touchend' && touch) {
    let t = getTouch(e);
    if (t) {
      let delta = Math.sqrt(
        Math.pow(t.pageX - touch.pageX, 2) +
        Math.pow(t.pageY - touch.pageY, 2)
      );
      if (delta < 10) {
        event.type = 'click';
        sendMessage({ type: 'event', event });
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

