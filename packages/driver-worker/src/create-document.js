const IS_DATASET_REG = /^data\-/;
function assign(obj, props) {
  for (let i in props) obj[i] = props[i];
}

function toLower(str) {
  return String(str).toLowerCase();
}

const CAMELCASE_REG = /\-[a-z]/g;
const CamelCaseCache = {};
function camelCase(str) {
  return (
    CamelCaseCache[str] ||
    (CamelCaseCache[str] = str.replace(CAMELCASE_REG, $1 =>
      $1.slice(1).toUpperCase()
    ))
  );
}

function splice(arr, item, add, byValueOnly) {
  let i = arr ? findWhere(arr, item, true, byValueOnly) : -1;
  if (~i) add ? arr.splice(i, 0, add) : arr.splice(i, 1);
  return i;
}

function findWhere(arr, fn, returnIndex, byValueOnly) {
  let i = arr.length;
  while (i--)
    if (typeof fn === 'function' && !byValueOnly ? fn(arr[i]) : arr[i] === fn)
      break;
  return returnIndex ? i : arr[i];
}

function createAttributeFilter(ns, name) {
  return o => o.ns === ns && toLower(o.name) === toLower(name);
}

let resolved = typeof Promise !== 'undefined' && Promise.resolve();
const setImmediate = resolved
  ? f => {
    resolved.then(f);
  }
  : setTimeout;
const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;
const DOCUMENT_NODE = 9;

export default function() {
  let observers = [];
  let pendingMutations = false;

  function mutation(target, type, record) {
    record.target = target;
    record.type = type;

    for (let i = observers.length; i--; ) {
      let ob = observers[i],
        match = target === ob._target;
      if (!match && ob._options.subtree) {
        do {
          if (match = target === ob._target) break;
        } while (target = target.parentNode);
      }
      if (match) {
        ob._records.push(record);
        if (!pendingMutations) {
          pendingMutations = true;
          setImmediate(flushMutations);
        }
      }
    }
  }

  function flushMutations() {
    pendingMutations = false;
    for (let i = observers.length; i--; ) {
      let ob = observers[i];
      if (ob._records.length) {
        ob.callback(ob.takeRecords());
      }
    }
  }

  class MutationObserver {
    constructor(callback) {
      this.callback = callback;
      this._records = [];
    }
    observe(target, options) {
      this.disconnect();
      this._target = target;
      this._options = options || {};
      observers.push(this);
    }
    disconnect() {
      this._target = null;
      splice(observers, this);
    }
    takeRecords() {
      return this._records.splice(0, this._records.length);
    }
  }

  function isElement(node) {
    return node.nodeType === ELEMENT_NODE;
  }
  function isDataset(attr) {
    return IS_DATASET_REG.test(attr.name);
  }

  const patchTransform = {
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    translateX: 0,
    translateY: 0,
    translateZ: 0,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    skewX: 0,
    skewY: 0
  };

  function dispatchAnimationToStyle(node, animationGroup) {
    // properties aren't belonged to transform
    const notBelongedToTransform = [
      'opacity',
      'backgroundColor',
      'width',
      'height',
      'top',
      'left',
      'bottom',
      'right'
    ];
    let nextProperties = {};
    let nextTranfrom = 'transform:';
    let transformActions = [];

    // actions about transform
    animationGroup.animation.map(prop => {
      switch (true) {
        case notBelongedToTransform.indexOf(prop[0]) > -1:
          if (prop[0] === 'backgroundColor') {
            prop[0] = 'background-color';
          }
          nextProperties[prop[0]] = prop[1];
          break;
        case prop[0].indexOf('rotate') > -1:
          transformActions.push({
            name: prop[0],
            value: prop[1].map(angle => {
              if (typeof angle === 'number') {
                return angle + 'deg';
              }
              return angle;
            })
          });
          break;
        default:
          transformActions.push({
            name: prop[0],
            value: prop[1]
          });
          break;
      }
    });

    // match actions and update patchTransform
    transformActions.forEach(action => {
      let initial = 0;
      if (action.name === 'matrix' || action.name === 'matrix3d') {
        nextTranfrom += ` ${action.name}(${action.value.join(',')})`;
      } else {
        // handle the situation that params are not fixed
        if (
          action.name === 'rotate' ||
          action.name === 'scale' ||
          action.name === 'translate' ||
          action.name === 'skew' ||
          action.name.indexOf('3d') > -1
        ) {
          switch (true) {
            // scale's initial is 1
            case action.name === 'scale':
              initial = 1;
            // if the rotate only has one param, it equals to rotateZ
            case action.value.length === 1 && action.name === 'rotate':
              patchTransform[`${action.name}Z`] = action.value[0] || initial;
              break;
            case action.value.length === 3:
              patchTransform[`${action.name}Z`] = action.value[2] || initial;
            default:
              patchTransform[`${action.name}X`] = action.value[0] || initial;
              patchTransform[`${action.name}Y`] = action.value[1] || initial;
              break;
          }
        } else {
          patchTransform[action.name] = action.value[0];
        }
      }
    });

    // stitching patchTransform into a string
    Object.keys(patchTransform).forEach(name => {
      nextTranfrom += ` ${name}(${patchTransform[name]})`;
    });

    /**
     * Merge onto style cssText
     * before every animationGroup setTimeout 16ms
     *
     * it shouldn't just assignment cssText
     * but parse cssText
     */
    setTimeout(() => {
      let properties = '';
      if (node.style.cssText) {
        const propList = node.style.cssText.replace(/;/g, ':').split(':');
        const style = {};
        const transformProperties = [
          'transition',
          'transform',
          'transform-origin'
        ];
        // traverse all properties that aren't about transform
        propList.forEach((prop, index) => {
          if (
            prop &&
            index % 2 === 0 &&
            transformProperties.indexOf(prop) < 0
          ) {
            style[prop] = propList[index + 1];
          }
        });
        // merge nextProperties into style
        nextProperties = Object.assign(style, nextProperties);
      }
      Object.keys(nextProperties).forEach(key => {
        properties += key + ':' + nextProperties[key] + ';';
      });
      node.style.cssText = `transition: all ${
        animationGroup.config.duration
      }ms ${animationGroup.config.timeFunction} ${
        animationGroup.config.delay
      }ms;transform-origin: ${
        animationGroup.config.transformOrigin
      };${nextTranfrom};${properties}`;
    }, 16);
  }

  class Node {
    constructor(nodeType, nodeName) {
      this.nodeType = nodeType;
      this.nodeName = nodeName;
      this.childNodes = [];
    }
    get nextSibling() {
      let p = this.parentNode;
      if (p) return p.childNodes[findWhere(p.childNodes, this, true) + 1];
    }
    get previousSibling() {
      let p = this.parentNode;
      if (p) return p.childNodes[findWhere(p.childNodes, this, true) - 1];
    }
    get firstChild() {
      return this.childNodes[0];
    }
    get lastChild() {
      return this.childNodes[this.childNodes.length - 1];
    }
    appendChild(child) {
      this.insertBefore(child);
      return child;
    }
    insertBefore(child, ref) {
      child.remove();
      child.parentNode = this;

      if (ref) {
        splice(this.childNodes, ref, child);
        mutation(this, 'childList', { addedNodes: [child], nextSibling: ref });
      } else {
        this.childNodes.push(child);
        mutation(this, 'childList', { addedNodes: [child] });
      }

      return child;
    }
    replaceChild(child, ref) {
      if (ref.parentNode === this) {
        this.insertBefore(child, ref);
        ref.remove();
        return ref;
      }
    }
    removeChild(child) {
      splice(this.childNodes, child);
      mutation(this, 'childList', { removedNodes: [child] });
      return child;
    }
    remove() {
      if (this.parentNode) this.parentNode.removeChild(this);
    }
  }

  class Text extends Node {
    constructor(text) {
      super(TEXT_NODE, '#text'); // TEXT_NODE
      this.data = text;
    }
    set textContent(text) {
      mutation(this, 'characterData', { newValue: text });
      this.data = text;
    }
    get textContent() {
      return this.data;
    }
  }

  class Element extends Node {
    constructor(nodeType, nodeName) {
      super(nodeType || ELEMENT_NODE, nodeName); // ELEMENT_NODE
      this.attributes = [];
      this.eventListeners = {};
      this.style = {};
      Object.defineProperty(this, 'className', {
        set: val => {
          this.setAttribute('class', val);
        },
        get: () => this.getAttribute('class')
      });
      Object.defineProperty(this, 'animation', {
        set(queues) {
          const len = queues.length;
          const handleAnimationQueue = () => {
            if (queues.length > 0) {
              dispatchAnimationToStyle(this, queues.shift());
            } else {
              this.removeEventListener('transitionend', handleAnimationQueue);
            }
          };
          if (len > 0) {
            dispatchAnimationToStyle(this, queues.shift());
            this.addEventListener('transitionend', handleAnimationQueue);
          }
        },
        get: () => this.getAttribute('animation')
      });
      Object.defineProperty(this.style, 'cssText', {
        set: val => {
          this.setAttribute('style', val);
        },
        get: () => this.getAttribute('style')
      });
    }

    get children() {
      return this.childNodes.filter(isElement);
    }

    get dataset() {
      const dataset = {};
      this.attributes.filter(isDataset).forEach(({ name, value }) => {
        dataset[camelCase(name.slice(5))] = value;
      });
      return dataset;
    }

    setAttribute(key, value) {
      if (value !== this.getAttribute(key)) {
        this.setAttributeNS(null, key, value);
      }
    }

    getAttribute(key) {
      return this.getAttributeNS(null, key);
    }

    removeAttribute(key) {
      this.removeAttributeNS(null, key);
    }

    setAttributeNS(ns, name, value) {
      let attr = findWhere(this.attributes, createAttributeFilter(ns, name));
      if (!attr) this.attributes.push(attr = { ns, name });

      // array and plain object will pass
      // through, instead of calling `toString`
      // null has been filtered before
      if (typeof value === 'object') {
        attr.value = value;
      } else {
        attr.value = String(value);
      }
      mutation(this, 'attributes', { attributeName: name, newValue: value });
    }

    getAttributeNS(ns, name) {
      let attr = findWhere(this.attributes, createAttributeFilter(ns, name));
      return attr && attr.value;
    }

    removeAttributeNS(ns, name) {
      splice(this.attributes, createAttributeFilter(ns, name));
      mutation(this, 'attributes', { attributeName: name });
    }

    addEventListener(type, handler) {
      (
        this.eventListeners[toLower(type)] ||
        (this.eventListeners[toLower(type)] = [])
      ).push(handler);
      mutation(this, 'addEvent', { eventName: type });
    }

    removeEventListener(type, handler) {
      splice(this.eventListeners[toLower(type)], handler, 0, true);
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
        l = t.eventListeners && t.eventListeners[toLower(event.type)];
        if (l)
          for (i = l.length; i--; ) {
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

  class Document extends Element {
    constructor() {
      super(DOCUMENT_NODE, '#document'); // DOCUMENT_NODE
    }
  }

  class Comment extends Node {
    constructor(text) {
      super(COMMENT_NODE, '#comment');
      this.data = text;
    }
  }

  class Event {
    constructor(type, opts) {
      this.type = type;
      this.bubbles = !!opts.bubbles;
      this.cancelable = !!opts.cancelable;
    }
    stopPropagation() {
      this._stop = true;
    }
    stopImmediatePropagation() {
      this._end = this._stop = true;
    }
    preventDefault() {
      this.defaultPrevented = true;
    }
  }

  class CanvasRenderingContext2D {
    constructor(vnode) {
      this.canvas = vnode;

      let propertyValues = {
        fillStyle: '#000000',
        filter: 'none',
        font: '10px sans-serif',
        globalAlpha: 1,
        globalCompositeOperation: 'source-over',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'low',
        lineCap: 'butt',
        lineDashOffset: 0,
        lineJoin: 'miter',
        lineWidth: 1,
        miterLimit: 10,
        shadowBlur: 0,
        shadowColor: 'rgba(0, 0, 0, 0)',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        strokeStyle: '#000000',
        textAlign: 'start',
        textBaseline: 'alphabetic'
      };

      // context properties
      const properties = [
        'direction',
        'fillStyle',
        'filter',
        'font',
        'globalAlpha',
        'globalCompositeOperation',
        'imageSmoothingEnabled',
        'imageSmoothingQuality',
        'lineCap',
        'lineDashOffset',
        'lineJoin',
        'lineWidth',
        'miterLimit',
        'shadowBlur',
        'shadowColor',
        'shadowOffsetX',
        'shadowOffsetY',
        'strokeStyle',
        'textAlign',
        'textBaseline'
      ];

      properties.forEach(property => {
        Object.defineProperty(this, property, {
          get: function() {
            return propertyValues[property];
          },
          set: function(value) {
            propertyValues[property] = value;
          }
        });
      });

      // context api
      const methods = [
        'arc',
        'arcTo',
        'addHitRegion',
        'beginPath',
        'bezierCurveTo',
        'clearHitRegions',
        'clearRect',
        'clip',
        'closePath',
        'createImageData',
        'createLinearGradient',
        'createPattern',
        'createRadialGradient',
        'drawFocusIfNeeded',
        'drawImage',
        'drawWidgetAsOnScreen',
        'drawWindow',
        'ellipse',
        'fill',
        'fillRect',
        'fillText',
        'getImageData',
        'getLineDash',
        'isPointInPath',
        'isPointInStroke',
        'lineTo',
        'measureText',
        'moveTo',
        'putImageData',
        'quadraticCurveTo',
        'rect',
        'removeHitRegion',
        'resetTransform',
        'restore',
        'rotate',
        'save',
        'scale',
        'scrollPathIntoView',
        'setLineDash',
        'setTransform',
        'stroke',
        'strokeRect',
        'strokeText',
        'transform',
        'translate'
      ];

      methods.forEach(method => {
        this[method] = (...args) => {
          mutation(vnode, 'canvasRenderingContext2D', {
            method: method,
            args: args,
            properties: Object.assign({}, propertyValues)
          });
        };
      });
    }
  }

  class CanvasElement extends Element {
    constructor(...args) {
      super(...args);
    }
    getContext(contextType) {
      if (contextType === '2d') {
        return new CanvasRenderingContext2D(this);
      } else {
        return {};
      }
    }
  }

  function createComment(content) {
    return new Comment(content);
  }

  function createElement(type) {
    if (type === 'canvas') {
      return new CanvasElement(null, String(type).toUpperCase());
    }
    return new Element(null, String(type).toUpperCase());
  }

  function createElementNS(ns, type) {
    let element = createElement(type);
    element.namespace = ns;
    return element;
  }

  function createTextNode(text) {
    return new Text(text);
  }

  function createDocument() {
    let document = new Document();
    assign(
      document,
      document.defaultView = {
        document,
        MutationObserver,
        Document,
        Node,
        Text,
        Element,
        SVGElement: Element,
        Event
      }
    );

    assign(document, {
      createComment,
      createElement,
      createElementNS,
      createTextNode
    });

    document.appendChild(document.documentElement = createElement('html'));
    document.documentElement.appendChild(
      document.head = createElement('head')
    );
    document.documentElement.appendChild(
      document.body = createElement('body')
    );
    return document;
  }

  return createDocument();
}
