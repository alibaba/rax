// feature-detect support for event listener options
let supportsPassive = false;
try {
  addEventListener('test', null, {
    get passive() {
      supportsPassive = true;
    }
  });
} catch (e) {}

const TEXT_CONTENT_ATTR =
  'textContent' in document ? 'textContent' : 'nodeValue';
const EVENT_OPTIONS = supportsPassive
  ? {
      capture: true,
      passive: true
    }
  : true;
const ELEMENT_NAME_PREFIX = 'a-';

export default ({ worker }) => {
  const NODES = new Map();
  const registeredEventCounts = {};

  /** Returns the real DOM Element corresponding to a serialized Element object. */
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

  // Derives {pageX,pageY} coordinates from a mouse or touch event.
  function getTouch(e) {
    let t =
      (e.changedTouches && e.changedTouches[0]) ||
      (e.touches && e.touches[0]) ||
      e;
    return t && { pageX: t.pageX, pageY: t.pageY };
  }

  function eventProxyHandler(e) {
    if (e.type === 'click' && touch) return false;

    let event = { type: e.type };
    if (e.target) event.target = e.target.$$id;
    // eslint-disable-next-line guard-for-in
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
      node = document.createElement(ELEMENT_NAME_PREFIX + vnode.nodeName);
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
          // TODO .ns
          node.setAttribute(a.name, a.value);
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
            (nextSibling && getNode(nextSibling)) || null
          );
        }
      }
    },
    attributes({ target, attributeName }) {
      // TODO performance optimize
      let vnode = target;
      let val;
      for (let i = vnode.attributes.length; i--; ) {
        let p = vnode.attributes[i];
        if (p.name === attributeName) {
          val = p.value;
          break;
        }
      }
      // TODO attributes remove handle
      getNode(vnode).setAttribute(attributeName, val);
    },
    characterData({ target, oldValue }) {
      let vnode = target;
      let node = getNode(vnode);
      node[TEXT_CONTENT_ATTR] = vnode.data;
    },
    events({ target, eventName }) {
      addEvent(eventName);
    }
  };

  function applyMutation(mutation) {
    MUTATIONS[mutation.type](mutation);
  }

  let timer;

  // stores pending DOM changes (MutationRecord objects)
  let MUTATION_QUEUE = [];

  // requestIdleCallback sortof-polyfill
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

  // Attempt to flush & process as many MutationRecords as possible from the queue
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
      // remove mutation from the queue and apply it:
      applyMutation(q.splice(i--, 1)[0]);
    }

    // still remaining work to be done
    if (q.length) doProcessMutationQueue();
  }

  function doProcessMutationQueue() {
    // requestAnimationFrame(processMutationQueue);
    clearTimeout(timer);
    timer = setTimeout(processMutationQueue, 100);
    requestIdleCallback(processMutationQueue);
  }

  // Add a MutationRecord to the queue
  function queueMutation(mutation) {
    // for single-node updates, merge into pending updates
    if (mutation.type === 'characterData' || mutation.type === 'attributes') {
      for (let i = MUTATION_QUEUE.length; i--; ) {
        let m = MUTATION_QUEUE[i];
        // eslint-disable-next-line eqeqeq
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
