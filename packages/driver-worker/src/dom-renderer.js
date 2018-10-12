import setStyle from './set-style';

// feature-detect support for event listener options
let supportsPassive = false;
try {
  addEventListener('test', null, {
    get passive() {
      supportsPassive = true;
    }
  });
} catch (e) { }

const TEXT_CONTENT = 'textContent';
const TEXT_CONTENT_ATTR = TEXT_CONTENT in document ? TEXT_CONTENT : 'nodeValue';
const TOUCH_EVENTS = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
const EVENT_OPTIONS = supportsPassive
  ? {
    capture: true,
    passive: true
  }
  : true;

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

export default ({ worker, tagNamePrefix = '' }) => {
  const NODES = new Map();
  const registeredEventCounts = {};

  function setNode(vnode, node) {
    node.$$id = vnode.$$id;
    return NODES.set(vnode.$$id, node);
  }

  function getNode(vnode) {
    if (!vnode) return null;
    if (vnode.nodeName === 'BODY') return document.body;
    return NODES.get(vnode.$$id);
  }

  function deleteNode(vnode) {
    if (!vnode) return null;
    return NODES.delete(vnode.$$id);
  }

  function addEvent(node, name) {
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

  function removeEvent(node, name) {
    if (NO_BUBBLES_EVENTS[name]) {
      removeNoBubblesEventListener(node, name);
    } else {
      registeredEventCounts[name]--;
      if (registeredEventCounts[name] === 0) {
        document.removeEventListener(name, eventProxyHandler);
      }
    }
  }

  function addNoBubblesEventListener(node, name) {
    function listener(evt) {
      const target = {
        $$id: node.$$id
      };
      worker.postMessage({
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

  function removeNoBubblesEventListener(node, name) {
    const listener = node[`__$${name}_listener__`];
    if (listener) {
      node.removeEventListener(name, listener);
      node[`__$${name}_listener__`] = null;
    }
  }

  let touch;
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

  function eventProxyHandler(e) {
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
      /**
       * In some android webkit, tag name is case-sensitive,
       * eg. a-VIEW is diffrenet with a-view
       */
      node = document.createElement(tagNamePrefix + vnode.nodeName.toLowerCase());

      if (vnode.className) {
        node.className = vnode.className;
      }

      if (vnode.style) {
        setStyle(node, vnode.style);
      }

      if (vnode.attributes) {
        for (let i = 0; i < vnode.attributes.length; i++) {
          let a = vnode.attributes[i];

          if (typeof a.value === 'object' || typeof a.value === 'boolean') {
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
          addEvent(node, vnode.events[i]);
        }
      }
    } else if (vnode.nodeType === 8) {
      node = document.createComment(vnode.data);
    }

    setNode(vnode, node);
    return node;
  }
  // Returns "attributes" if it was an attribute mutation.
  // "characterData" if it was a mutation to a CharacterData node.
  // And "childList" if it was a mutation to the tree of nodes.
  const MUTATIONS = {
    childList({ target, removedNodes, addedNodes, nextSibling }) {
      let vnode = target;

      if (vnode && vnode.nodeName === 'BODY') {
        document.body.$$id = vnode.$$id;
      }

      let parent = getNode(vnode);
      if (removedNodes) {
        for (let i = removedNodes.length; i--;) {
          let node = getNode(removedNodes[i]);
          deleteNode(node);
          if (parent && node) {
            parent.removeChild(node);
          }
        }
      }

      if (addedNodes) {
        for (let i = 0; i < addedNodes.length; i++) {
          let newNode = getNode(addedNodes[i]);
          if (!newNode) {
            newNode = createNode(addedNodes[i]);
          }

          if (parent) {
            parent.insertBefore(newNode, nextSibling && getNode(nextSibling) || null);
          }
        }
      }
    },
    attributes({ target, attributeName, newValue, style }) {
      let node = getNode(target);
      // Node maybe null when node is removed and there is a setInterval change the node that will cause error
      if (!node) return;

      // TODO: some with `createNode`, should processed by one method
      if (style) {
        setStyle(node, style);
      } else if (newValue == null) {
        node.removeAttribute(attributeName);
      } else if (typeof newValue === 'object' || typeof newValue === 'boolean') {
        node[attributeName] = newValue;
      } else {
        node.setAttribute(attributeName, newValue);
      }
    },
    characterData({ target, newValue }) {
      let node = getNode(target);
      node[TEXT_CONTENT_ATTR] = newValue;
    },
    addEvent({ target, eventName }) {
      let node = getNode(target);
      if (!node) return;

      addEvent(node, eventName);
    },
    removeEvent({ target, eventName }) {
      let node = getNode(target);
      if (!node) return;

      removeEvent(node, eventName);
    },
    canvasRenderingContext2D({ target, method, args, properties }) {
      let canvas = getNode(target);
      if (!canvas) return;

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

  worker.onmessage = ({ data }) => {
    let type = data.type;
    if (type === 'MutationRecord') {
      let mutations = data.mutations;
      for (let i = 0; i < mutations.length; i++) {
        // apply mutation
        let mutation = mutations[i];
        MUTATIONS[mutation.type](mutation);
      }
    } else if (type === 'Location') {
      const { data: payload } = data;
      const { type, prop } = payload;
      if (type === 'call' && prop === 'replace') {
        location.replace(payload.args[0]);
      }
    }
  };

  worker.postMessage({
    type: 'init',
    url: location.href,
    width: document.documentElement.clientWidth
  });
};
