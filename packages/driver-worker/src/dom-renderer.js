// feature-detect support for event listener options
let supportsPassive = false;
try {
  addEventListener('test', null, {
    get passive() {
      supportsPassive = true;
    }
  });
} catch (e) {}

const TEXT_CONTENT_ATTR = 'textContent' in document ? 'textContent' : 'nodeValue';
const EVENT_OPTIONS = supportsPassive
  ? {
    capture: true,
    passive: true
  }
  : true;

export default ({ worker, tagNamePrefix = '' }) => {
  const NODES = new Map();
  const registeredEventCounts = {};
  const canvasCache = {};

  function getNode(node) {
    if (!node) return null;
    if (node.nodeName === 'BODY') return document.body;
    return NODES.get(node.$$id);
  }

  function addEvent(name) {
    const registeredCount = registeredEventCounts[name];

    if (!registeredCount) {
      registeredEventCounts[name] = 1;
      // Top-level register
      document.addEventListener(name, eventProxyHandler, EVENT_OPTIONS);
    } else {
      registeredEventCounts[name]++;
    }
  }

  function removeEvent() {
    registeredEventCounts[name]--;
    if (registeredEventCounts[name] === 0) {
      document.removeEventListener(name, eventProxyHandler);
    }
  }

  let touch;
  function getTouch(e) {
    let t =
      e.changedTouches && e.changedTouches[0] ||
      e.touches && e.touches[0] ||
      e;
    return t && { pageX: t.pageX, pageY: t.pageY };
  }

  function eventProxyHandler(e) {
    if (e.type === 'click' && touch) return false;

    let event = { type: e.type };
    if (e.target) event.target = e.target.$$id;
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

    worker.postMessage({
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
          worker.postMessage({ type: 'event', event });
        }
      }
    }
  }

  function createNode(vnode) {
    let node;
    if (vnode.nodeType === 3) {
      node = document.createTextNode(vnode.data);
    } else if (vnode.nodeType === 1) {
      node = document.createElement(tagNamePrefix + vnode.nodeName);
      if (vnode.className) {
        node.className = vnode.className;
      }
      if (vnode.style) {
        for (let i in vnode.style)
          if (vnode.style.hasOwnProperty(i)) {
            node.style[i] = vnode.style[i];
          }
      }
      if (vnode.attributes) {
        for (let i = 0; i < vnode.attributes.length; i++) {
          let a = vnode.attributes[i];

          if (typeof a.value === 'object') {
            node[a.name] = a.value;
          } else {
            node.setAttribute(a.name, a.value);
          }
        }
      }
      if (vnode.childNodes) {
        for (let i = 0; i < vnode.childNodes.length; i++) {
          node.appendChild(createNode(vnode.childNodes[i]));
        }
      }
      if (vnode.events) {
        for (let i = 0; i < vnode.events.length; i++) {
          addEvent(vnode.events[i]);
        }
      }
    } else if (vnode.nodeType === 8) {
      node = document.createComment(vnode.data);
    }

    node.$$id = vnode.$$id;
    NODES.set(vnode.$$id, node);
    return node;
  }
  // Returns "attributes" if it was an attribute mutation.
  // "characterData" if it was a mutation to a CharacterData node.
  // And "childList" if it was a mutation to the tree of nodes.
  const MUTATIONS = {
    childList({ target, removedNodes, addedNodes, nextSibling }) {
      let vnode = target;
      let parent = getNode(vnode);
      if (removedNodes) {
        for (let i = removedNodes.length; i--; ) {
          parent.removeChild(getNode(removedNodes[i]));
        }
      }

      if (addedNodes) {
        for (let i = 0; i < addedNodes.length; i++) {
          let newNode = getNode(addedNodes[i]);
          if (!newNode) {
            newNode = createNode(addedNodes[i]);
          }
          parent.insertBefore(
            newNode,
            nextSibling && getNode(nextSibling) || null
          );
        }
      }
    },
    attributes({ target, attributeName, newValue }) {
      let vnode = target;
      let node = getNode(vnode);
      if (newValue == null) {
        node.removeAttribute(attributeName);
      } else if (typeof newValue === 'object') {
        node[attributeName] = newValue;
      } else {
        node.setAttribute(attributeName, newValue);
      }
    },
    characterData({ target, newValue }) {
      let vnode = target;
      let node = getNode(vnode);
      node[TEXT_CONTENT_ATTR] = newValue;
    },
    addEvent({ target, eventName }) {
      addEvent(eventName);
    },
    removeEvent({ target, eventName }) {
      removeEvent(eventName);
    },
    canvasRenderingContext2D({ target, method, args, properties }) {
      let vnode = target;
      let canvas = getNode(vnode);
      let context = canvas.getContext('2d');

      if (properties) {
        for (let key in properties) {
          if (properties.hasOwnProperty(key)) {
            context[key] = properties[key];
          }
        }
      }

      if (method) {
        context[method].apply(context, args);
      }
    }
  };

  function applyMutation(mutation) {
    MUTATIONS[mutation.type](mutation);
  }

  let timer;
  let MUTATION_QUEUE = [];

  if (!window.requestIdleCallback) {
    const IDLE_TIMEOUT = 10;
    window.requestIdleCallback = cb => {
      let start = Date.now();
      setTimeout(
        () =>
          cb({
            timeRemaining: () =>
              Math.max(0, IDLE_TIMEOUT - (Date.now() - start))
          }),
        1
      );
    };
  }

  function processMutationQueue(deadline) {
    clearTimeout(timer);
    let q = MUTATION_QUEUE;
    let start = Date.now();
    let isDeadline = deadline && deadline.timeRemaining;
    let cache = {};
    let i;

    for (i = 0; i < q.length; i++) {
      if (isDeadline ? deadline.timeRemaining() <= 0 : Date.now() - start > 1)
        break;

      let m = q[i];
      applyMutation(q.splice(i--, 1)[0]);
    }

    if (q.length) doProcessMutationQueue();
  }

  function doProcessMutationQueue() {
    clearTimeout(timer);
    timer = setTimeout(processMutationQueue, 100);
    requestIdleCallback(processMutationQueue);
  }

  function queueMutation(mutation) {
    if (mutation.type === 'characterData' || mutation.type === 'attributes') {
      for (let i = MUTATION_QUEUE.length; i--; ) {
        let m = MUTATION_QUEUE[i];
        if (m.type == mutation.type && m.target.$$id == mutation.target.$$id) {
          if (m.type === 'attributes') {
            MUTATION_QUEUE.splice(i + 1, 0, mutation);
          } else {
            MUTATION_QUEUE[i] = mutation;
          }
          return;
        }
      }
    }
    if (MUTATION_QUEUE.push(mutation) === 1) {
      doProcessMutationQueue();
    }
  }

  worker.onmessage = ({ data }) => {
    let type = data.type;
    if (type === 'MutationRecord') {
      for (let i = 0; i < data.mutations.length; i++) {
        queueMutation(data.mutations[i]);
      }
    }
  };

  worker.postMessage({
    type: 'init',
    url: location.href,
    width: document.documentElement.clientWidth
  });
};
