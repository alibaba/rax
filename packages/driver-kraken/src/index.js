/**
 * Driver for Kraken
 **/

const RPX_REG = /[-+]?\d*\.?\d+(rpx)/g;
const NON_DIMENSIONAL_REG = /opa|ntw|ne[ch]|ex(?:s|g|n|p|$)|^ord|zoo|grid|orp|ows|mnc|^columns$|bs|erim|onit/i;
const EVENT_PREFIX_REG = /^on[A-Z]/;
const DANGEROUSLY_SET_INNER_HTML = 'dangerouslySetInnerHTML';
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
const EMPTY = '';

let viewportWidth = 750;
let unitPrecision = 4;

/**
 * Create a cached version of a pure function.
 */
function cached(fn) {
  const cache = Object.create(null);
  return function cachedFn(str) {
    return cache[str] || (cache[str] = fn(str));
  };
}

const isEventProp = cached(prop => EVENT_PREFIX_REG.test(prop));

export function createBody() {
  return document.body;
}

export function createEmpty(component) {
  return document[CREATE_COMMENT](EMPTY);
}

export function createText(text, component) {
  return document[CREATE_TEXT_NODE](text);
}

export function updateText(node, text) {
  node[TEXT_CONTENT_ATTR] = text;
}

export function createElement(type, props, component, __shouldConvertUnitlessToRpx, __shouldConvertRpxToVw = true) {
  const node = document[CREATE_ELEMENT](type);

  for (let prop in props) {
    const value = props[prop];
    if (prop === CHILDREN) continue;

    if (value != null) {
      if (prop === STYLE) {
        setStyle(node, value, __shouldConvertUnitlessToRpx, __shouldConvertRpxToVw);
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
  return parent.appendChild(node);
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
  if (propKey === DANGEROUSLY_SET_INNER_HTML) return;

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
  if (propKey === DANGEROUSLY_SET_INNER_HTML) {
    warnUnsupport(DANGEROUSLY_SET_INNER_HTML);
    return;
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

function toFixed(number, precision) {
  const multiplier = Math.pow(10, precision + 1);
  const wholeNumber = Math.floor(number * multiplier);
  return Math.round(wholeNumber / 10) * 10 / multiplier;
}

function unitTransformer(n) {
  return toFixed(parseFloat(n) / (viewportWidth / 100), unitPrecision) + 'vw';
}

function isRpx(str) {
  return RPX_REG.test(str);
}

function calcRpxToVw(value) {
  return value.replace(RPX_REG, unitTransformer);
}

const isDimensionalProp = cached(prop => !NON_DIMENSIONAL_REG.test(prop));
const convertUnit = cached(value => isRpx(value) ? calcRpxToVw(value) : value);

export function setStyle(node, style, __shouldConvertUnitlessToRpx, __shouldConvertRpxToVw = true) {
  for (let prop in style) {
    const value = style[prop];
    let convertedValue;
    if (typeof value === 'number' && isDimensionalProp(prop)) {
      if (__shouldConvertUnitlessToRpx) {
        convertedValue = value + 'rpx';
        if (__shouldConvertRpxToVw) {
          // Transfrom rpx to vw
          convertedValue = convertUnit(convertedValue);
        }
      } else {
        convertedValue = value + 'px';
      }
    } else {
      convertedValue = __shouldConvertRpxToVw ? convertUnit(value) : value;
    }

    // Support CSS custom properties (variables) like { --main-color: "black" }
    if (prop[0] === '-' && prop[1] === '-') {
      // reference: https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/setProperty.
      // style.setProperty do not support Camel-Case style properties.
      node.style.setProperty(prop, convertedValue);
    } else {
      node.style[prop] = convertedValue;
    }
  }
}

function warnUnsupport(message) {
  console.warn(`[DriverKraken]: ${message} is not supported.`);
}
