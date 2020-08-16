import { setRpx, convertUnit } from 'style-unit';

const STYLE = 'style';
const ID = 'id';
const TEXT = 'text';
const CHILDREN = 'children';
const EVENT_PREFIX_REGEXP = /^on[A-Z]/;
const ARIA_PREFIX_REGEXP = /^aria-/;
const HYPHEN_REGEXP = /\-(\w)/;
const EMPTY = '';

function updateWeexTextValue(node) {
  const value = node.children.map(function(child) {
    // Comment node type
    return child.nodeType === 8 ? child.value : EMPTY;
  }).join(EMPTY);

  node.setAttr('value', value);
}

const nodeMaps = {};
/* global __weex_document__ */
const document = typeof __weex_document__ === 'object' ?
  __weex_document__ : typeof document === 'object' ?
    document : null;

export function getElementById(id) {
  return nodeMaps[id];
}

export function createBody(type, props) {
  if (document.body) {
    return document.body;
  }

  const documentElement = document.documentElement;
  const body = document.createBody(type, props);
  documentElement.appendChild(body);

  return body;
}

export function createComment(content) {
  return document.createComment(content);
}

export function createEmpty() {
  return createComment(EMPTY);
}

export function createText(text) {
  // Use comment node type mock text node
  return createComment(text);
}

export function updateText(node, text) {
  node.value = text;
  updateWeexTextValue(node.parentNode);
}

export function createElement(type, props = {}) {
  const style = {};
  const originStyle = props.style;
  if (originStyle) {
    for (let prop in originStyle) {
      style[prop] = convertUnit(originStyle[prop], prop);
    }
  }

  const node = document.createElement(type, {
    style
  });

  for (let prop in props) {
    let value = props[prop];
    if (prop === CHILDREN) {
      continue;
    }
    if (value != null) {
      if (prop === STYLE) {
        continue;
      } else if (EVENT_PREFIX_REGEXP.test(prop)) {
        let eventName = prop.slice(2).toLowerCase();
        addEventListener(node, eventName, value, props);
      } else {
        setAttribute(node, prop, value);
      }
    }
  }

  return node;
}

export function appendChild(node, parent) {
  parent.appendChild(node);

  if (parent.type === TEXT) {
    updateWeexTextValue(parent);
  }
}

export function removeChild(node, parent) {
  parent = parent || node.parentNode;
  let id = node.attr && node.attr[ID];
  if (id != null) {
    nodeMaps[id] = null;
  }

  parent.removeChild(node);

  if (parent.type === TEXT) {
    updateWeexTextValue(parent);
  }
}

export function replaceChild(newChild, oldChild, parent) {
  parent = parent || oldChild.parentNode;
  let previousSibling = oldChild.previousSibling;
  let nextSibling = oldChild.nextSibling;
  removeChild(oldChild, parent);

  if (previousSibling) {
    insertAfter(newChild, previousSibling, parent);
  } else if (nextSibling) {
    insertBefore(newChild, nextSibling, parent);
  } else {
    appendChild(newChild, parent);
  }
}

export function insertAfter(node, after, parent) {
  parent = parent || after.parentNode;
  parent.insertAfter(node, after);

  if (parent.type === TEXT) {
    updateWeexTextValue(parent);
  }
}

export function insertBefore(node, before, parent) {
  parent = parent || before.parentNode;
  parent.insertBefore(node, before);

  if (parent.type === TEXT) {
    updateWeexTextValue(parent);
  }
}

export function addEventListener(node, eventName, eventHandler, props) {
  // https://github.com/apache/incubator-weex/blob/master/runtime/vdom/Element.js#L421
  let params = props[eventName + 'EventParams'];
  return node.addEvent(eventName, eventHandler, params);
}

export function removeEventListener(node, eventName, eventHandler) {
  return node.removeEvent(eventName, eventHandler);
}

export function removeAttribute(node, propKey, propValue) {
  if (propKey == ID) {
    nodeMaps[propValue] = null;
  }
  // Weex native will crash when pass null value
  return node.setAttr(propKey, undefined, false);
}

export function setAttribute(node, propKey, propValue) {
  if (propKey == ID) {
    nodeMaps[propValue] = node;
  }

  // Weex only support `ariaLabel` format, convert `aria-label` format to camelcase
  if (ARIA_PREFIX_REGEXP.test(propKey)) {
    propKey = propKey.replace(HYPHEN_REGEXP, function(m, p) {
      return p.toUpperCase();
    });
  }

  return node.setAttr(propKey, propValue, false);
}

export function setStyle(node, style) {
  for (let prop in style) {
    // Translate `rpx` to weex `px`
    style[prop] = convertUnit(style[prop], prop);
  }
  node.setStyles(style);
}

export function beforeRender() {
  // Turn off batched updates
  document.open();

  // Set `rpx` unit converter
  setRpx(1);
}

export function afterRender() {
  if (document.listener && document.listener.createFinish) {
    document.listener.createFinish();
  }

  // Turn on batched updates
  document.close();
}
