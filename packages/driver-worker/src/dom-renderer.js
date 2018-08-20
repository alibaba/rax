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

export default ({ worker, tagNamePrefix = '' }) => {
  const NODES = new Map();
  const registeredEventCounts = {};
  const canvasCache = {};

  function getNode(node) {
    if (!node) return null;
    if (node.nodeName === 'BODY') return document.body;
    return NODES.get(node.$$id);
  }

  function addEvent(name, vnode) {
    if (name === 'appear' || name === 'disappear') {
      addAppearEvent(name, vnode);
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

  function removeEvent(name, vnode) {
    if (name === 'appear' || name === 'disappear') {
      removeAppearEvent(name, vnode);
    } else {
      registeredEventCounts[name]--;
      if (registeredEventCounts[name] === 0) {
        document.removeEventListener(name, eventProxyHandler);
      }
    }
  }

  const appearEventStore = {};
  function addAppearEvent(name, vnode) {
    const evtStore = appearEventStore[name] = appearEventStore[name] || {};
    // el may not add to DOM Tree
    setTimeout(() => {
      const el = getNode(vnode);
      if (el) {
        el.addEventListener(name, evtStore[vnode.$$id] = function(evt) {
          const {
            bottom, height,
            left, right,
            top, width,
            x, y,
          } = evt.target.getBoundingClientRect();
          const target = { $$id: el.$$id };
          worker.postMessage({
            type: 'event',
            event: {
              type: name,
              target,
              currentTarget: target,
              detail: {
                bottom, height,
                left, right,
                top, width,
                x, y,
              }
            }
          });
        });
      }
    }, 0);
  }

  function removeAppearEvent(name, vnode) {
    const evtStore = appearEventStore[name] = appearEventStore[name] || {};
    if (evtStore[vnode.$$id]) {
      const el = getNode(vnode);
      el && el.removeEventListener(name, evtStore[vnode.$$id]);
      delete evtStore[vnode.$$id];
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
          addEvent(vnode.events[i], vnode);
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

      if (vnode && vnode.nodeName === 'BODY') {
        document.body.$$id = vnode.$$id;
      }

      let parent = getNode(vnode);
      if (removedNodes) {
        for (let i = removedNodes.length; i--;) {
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
      addEvent(eventName, target);
    },
    removeEvent({ target, eventName }) {
      removeEvent(eventName, target);
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

  worker.onmessage = ({ data }) => {
    let type = data.type;
    if (type === 'MutationRecord') {
      let mutations = data.mutations;
      for (let i = 0; i < mutations.length; i++) {
        // apply mutation
        let mutation = mutations[i];
        MUTATIONS[mutation.type](mutation);
      }
    }
  };

  worker.postMessage({
    type: 'init',
    url: location.href,
    width: document.documentElement.clientWidth
  });
};
