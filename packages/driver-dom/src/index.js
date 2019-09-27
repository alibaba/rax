/**
 * Driver for Web DOM
 **/
const RPX_REG = /[-+]?\d*\.?\d+(rpx)/g;
const DANGEROUSLY_SET_INNER_HTML = 'dangerouslySetInnerHTML';
const __HTML = '__html';
const INNER_HTML = 'innerHTML';
const CLASS_NAME = 'className';
const CLASS = 'class';
const STYLE = 'style';
const CHILDREN = 'children';
const TEXT_CONTENT_ATTR = 'textContent';
const CREATE_ELEMENT = 'createElement';
const CREATE_COMMENT = 'createComment';
const CREATE_TEXT_NODE = 'createTextNode';
const SET_ATTRIBUTE = 'setAttribute';
const REMOVE_ATTRIBUTE = 'removeAttribute';
const EVENT_PREFIX_REGEXP = /^on[A-Z]/;
const SVG_NS = 'http://www.w3.org/2000/svg';
const TEXT_NODE = 3;
const COMMENT_NODE = 8;
const EMPTY = '';
const HYDRATION_INDEX = '__i';
const HYDRATION_APPEND = '__a';
const DOCUMENT = document;

let tagNamePrefix = EMPTY;
// Flag indicating if the diff is currently within an SVG
let isSVGMode = false;
let isHydrating = false;
let viewportWidth = 750;
let unitPrecision = 4;
let decimalPixelTransformer = (value) => value;

/**
 * Set viewport width.
 * @param viewport {Number} Viewport width, default to 750.
 */
export function setViewportWidth(viewport) {
  viewportWidth = viewport;
}

/**
 * Set unit precision.
 * @param n {Number} Unit precision, default to 4.
 */
export function setUnitPrecision(n) {
  unitPrecision = n;
}

/**
 * Set a function to transform unit of pixel,
 * default to passthrough.
 * @param {Function} transformer function
 */
export function setDecimalPixelTransformer(transformer) {
  decimalPixelTransformer = transformer;
}

function unitTransformer(n) {
  return toFixed(parseFloat(n) / (viewportWidth / 100), unitPrecision) + 'vw';
}

function toFixed(number, precision) {
  const multiplier = Math.pow(10, precision + 1);
  const wholeNumber = Math.floor(number * multiplier);
  return Math.round(wholeNumber / 10) * 10 / multiplier;
}

/**
 * Create a cached version of a pure function.
 */
function cached(fn) {
  const cache = Object.create(null);
  return function cachedFn(str) {
    return cache[str] || (cache[str] = fn(str));
  };
}

function calcRpxToVw(value) {
  return value.replace(RPX_REG, unitTransformer);
}

function isRpx(str) {
  return typeof str === 'string' && str.slice(0, -3) === 'rpx';
}

// Cache the convert fn.
const convertUnit = cached((value) => isRpx(value) ? calcRpxToVw(value) : value);

const isEventProp = cached((prop) => EVENT_PREFIX_REGEXP.test(prop));

export function setTagNamePrefix(prefix) {
  tagNamePrefix = prefix;
}

export function createBody() {
  return DOCUMENT.body;
}

export function createEmpty(component) {
  const parent = component._parent;
  let node;

  if (isHydrating) {
    const hydrationChild = findHydrationChild(parent);

    if (hydrationChild) {
      if (hydrationChild.nodeType === COMMENT_NODE) {
        return hydrationChild;
      } else {
        node = DOCUMENT[CREATE_COMMENT](EMPTY);
        replaceChild(node, hydrationChild, parent);
      }
    } else {
      node = DOCUMENT[CREATE_COMMENT](EMPTY);
      node[HYDRATION_APPEND] = true;
    }
  } else {
    node = DOCUMENT[CREATE_COMMENT](EMPTY);
  }

  return node;
}

export function createText(text, component) {
  const parent = component._parent;
  let node;

  if (isHydrating) {
    const hydrationChild = findHydrationChild(parent);

    if (hydrationChild) {
      if (hydrationChild.nodeType === TEXT_NODE) {
        if (text !== hydrationChild[TEXT_CONTENT_ATTR]) {
          hydrationChild[TEXT_CONTENT_ATTR] = text;
        }
        return hydrationChild;
      } else {
        node = DOCUMENT[CREATE_TEXT_NODE](text);
        replaceChild(node, hydrationChild, parent);
      }
    } else {
      node = DOCUMENT[CREATE_TEXT_NODE](text);
      node[HYDRATION_APPEND] = true;
    }
  } else {
    node = DOCUMENT[CREATE_TEXT_NODE](text);
  }

  return node;
}

export function updateText(node, text) {
  node[TEXT_CONTENT_ATTR] = text;
}

function findHydrationChild(parent) {
  if (parent[HYDRATION_INDEX] == null) {
    parent[HYDRATION_INDEX] = 0;
  }

  return parent.childNodes[parent[HYDRATION_INDEX]++];
}

export function createElement(type, props, component) {
  const parent = component._parent;
  isSVGMode = type === 'svg' || parent && parent.namespaceURI === SVG_NS;
  let node;
  let hydrationChild = null;

  function createNode() {
    if (isSVGMode) {
      node = DOCUMENT.createElementNS(SVG_NS, type);
    } else if (tagNamePrefix) {
      let tagNamePrefix = typeof tagNamePrefix === 'function' ? tagNamePrefix(type) : tagNamePrefix;
      node = DOCUMENT[CREATE_ELEMENT](tagNamePrefix + type);
    } else {
      node = DOCUMENT[CREATE_ELEMENT](type);
    }
  }

  if (isHydrating) {
    hydrationChild = findHydrationChild(parent);

    if (hydrationChild) {
      if (type === hydrationChild.nodeName.toLowerCase()) {
        for (let attributes = hydrationChild.attributes, i = attributes.length; i--;) {
          const attribute = attributes[i];
          const attributeName = attribute.name;
          const propValue = props[attributeName];

          if (
            // The class or className prop all not in props
            attributeName === CLASS && props[CLASS_NAME] == null && propValue == null ||
            // The style prop is empty object or not in props
            attributeName === STYLE && (propValue == null || Object.keys(propValue).length === 0) ||
            // Remove rendered node attribute that not existed
            attributeName !== CLASS && attributeName !== STYLE && propValue == null
          ) {
            hydrationChild[REMOVE_ATTRIBUTE](attributeName);
            continue;
          }

          if (attributeName === STYLE) {
            // Remove invalid style prop, and direct reset style to child avoid diff style
            for (let i = 0, l = hydrationChild.style.length; i < l; i++) {
              let stylePropName = hydrationChild.style[i];
              if (!propValue[stylePropName]) {
                hydrationChild.style[stylePropName] = EMPTY;
              }
            }
          }
        }

        node = hydrationChild;
      } else {
        createNode();
        replaceChild(node, hydrationChild, parent);
      }
    } else {
      createNode();
      node[HYDRATION_APPEND] = true;
    }
  } else {
    createNode();
  }

  for (let prop in props) {
    const value = props[prop];
    if (prop === CHILDREN) continue;

    if (value != null) {
      if (prop === STYLE) {
        setStyle(node, value);
      } else if (isEventProp(prop)) {
        addEventListener(node, prop.slice(2).toLowerCase(), value, component);
      } else {
        setAttribute(node, prop, value);
      }
    }
  }

  return node;
}

export function appendChild(node, parent) {
  if (!isHydrating || node[HYDRATION_APPEND]) {
    return parent.appendChild(node);
  }
}

export function removeChild(node, parent) {
  parent = parent || node.parentNode;
  // Maybe has been removed when remove child
  if (parent) {
    parent.removeChild(node);
  }
}

export function replaceChild(newChild, oldChild, parent) {
  parent = parent || oldChild.parentNode;
  parent.replaceChild(newChild, oldChild);
}

export function insertAfter(node, after, parent) {
  parent = parent || after.parentNode;
  const nextSibling = after.nextSibling;
  if (nextSibling) {
    // Performance improve when node has been existed before nextSibling
    if (nextSibling !== node) {
      insertBefore(node, nextSibling, parent);
    }
  } else {
    appendChild(node, parent);
  }
}

export function insertBefore(node, before, parent) {
  parent = parent || before.parentNode;
  parent.insertBefore(node, before);
}

export function addEventListener(node, eventName, eventHandler) {
  return node.addEventListener(eventName, eventHandler);
}

export function removeEventListener(node, eventName, eventHandler) {
  return node.removeEventListener(eventName, eventHandler);
}

export function removeAttribute(node, propKey) {
  if (propKey === DANGEROUSLY_SET_INNER_HTML) {
    return node[INNER_HTML] = null;
  }

  if (propKey === CLASS_NAME) propKey = CLASS;

  if (propKey in node) {
    try {
      // Some node property is readonly when in strict mode
      node[propKey] = null;
    } catch (e) { }
  }

  node[REMOVE_ATTRIBUTE](propKey);
}

export function setAttribute(node, propKey, propValue) {
  // For reduce innerHTML operation to improve performance.
  if (propKey === DANGEROUSLY_SET_INNER_HTML && node[INNER_HTML] !== propValue[__HTML]) {
    return node[INNER_HTML] = propValue[__HTML];
  }

  if (propKey === CLASS_NAME) propKey = CLASS;

  if (propKey in node) {
    try {
      // Some node property is readonly when in strict mode
      node[propKey] = propValue;
    } catch (e) {
      node[SET_ATTRIBUTE](propKey, propValue);
    }
  } else {
    node[SET_ATTRIBUTE](propKey, propValue);
  }
}

export function setStyle(node, style) {
  for (let prop in style) {
    // Support CSS custom properties
    const convertedValue = convertUnit(style[prop]);
    if (prop[0] === '-' && prop[1] === '-') {
      // reference: https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/setProperty. style.setProperty do not support Camel-Case style properties.
      node.style.setProperty(prop, convertedValue);
    } else {
      node.style[prop] = convertedValue;
    }
  }
}

export function beforeRender({ hydrate }) {
  isHydrating = hydrate;
}

function recolectHydrationChild(hydrationParent) {
  const nativeLength = hydrationParent.childNodes.length;
  const vdomLength = hydrationParent[HYDRATION_INDEX] || 0;
  if (nativeLength - vdomLength > 0) {
    for (let i = nativeLength - 1; i >= vdomLength; i--) {
      hydrationParent.removeChild(hydrationParent.childNodes[i]);
    }
  }

  for (let j = hydrationParent.childNodes.length - 1; j >= 0; j--) {
    recolectHydrationChild(hydrationParent.childNodes[j]);
  }
}

export function afterRender({ container }) {
  if (isHydrating) {
    // Remove native node when more then vdom node
    recolectHydrationChild(container);
    isHydrating = false;
  }
}

/**
 * Remove all children from node.
 * @NOTE: Optimization at web.
 */
export function removeChildren(node) {
  node.textContent = '';
}
