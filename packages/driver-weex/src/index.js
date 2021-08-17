import { setRpx, convertUnit } from 'style-unit';
import * as DriverDOM from 'driver-dom';

// Use driver-dom in Weex V2
/* global __weex_v2__ */
const isWeexV2 = typeof __weex_v2__ === 'object';

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
const weexDocument = typeof __weex_document__ === 'object' ?
  __weex_document__ : typeof document === 'object' ?
    document : null;

export function getElementById(id) {
  if (isWeexV2) {
    return document.getElementById(id);
  }
  return nodeMaps[id];
}

export function createBody(type, props) {
  if (isWeexV2) {
    return DriverDOM.createBody();
  }
  if (weexDocument.body) {
    return weexDocument.body;
  }

  const documentElement = weexDocument.documentElement;
  const body = weexDocument.createBody(type, props);
  documentElement.appendChild(body);

  return body;
}

export function createComment(content) {
  return weexDocument.createComment(content);
}

export function createEmpty(component) {
  if (isWeexV2) {
    return DriverDOM.createEmpty(component);
  }
  return createComment(EMPTY);
}

export function createText(text, component) {
  if (isWeexV2) {
    return DriverDOM.createText(text, component);
  }
  // Use comment node type mock text node
  return createComment(text);
}

export function updateText(node, text) {
  if (isWeexV2) {
    return DriverDOM.updateText(node, text);
  }
  node.value = text;
  updateWeexTextValue(node.parentNode);
}

export function createElement(type, props, component) {
  if (isWeexV2) {
    return DriverDOM.createElement(type, props, component, true);
  }
  const style = {};
  props = props || {};
  const originStyle = props.style;
  if (originStyle) {
    for (let prop in originStyle) {
      style[prop] = convertUnit(originStyle[prop], prop);
    }
  }

  const node = weexDocument.createElement(type, {
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
  if (isWeexV2) {
    return DriverDOM.appendChild(node, parent);
  }
  parent.appendChild(node);

  if (parent.type === TEXT) {
    updateWeexTextValue(parent);
  }
}

export function removeChild(node, parent) {
  if (isWeexV2) {
    return DriverDOM.removeChild(node, parent);
  }
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
  if (isWeexV2) {
    return DriverDOM.replaceChild(newChild, oldChild, parent);
  }
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
  if (isWeexV2) {
    return DriverDOM.insertAfter(node, after, parent);
  }
  parent = parent || after.parentNode;
  parent.insertAfter(node, after);

  if (parent.type === TEXT) {
    updateWeexTextValue(parent);
  }
}

export function insertBefore(node, before, parent) {
  if (isWeexV2) {
    return DriverDOM.insertBefore(node, before, parent);
  }
  parent = parent || before.parentNode;
  parent.insertBefore(node, before);

  if (parent.type === TEXT) {
    updateWeexTextValue(parent);
  }
}

export function addEventListener(node, eventName, eventHandler, props) {
  if (isWeexV2) {
    return DriverDOM.addEventListener(node, eventName, eventHandler);
  }
  // https://github.com/apache/incubator-weex/blob/master/runtime/vdom/Element.js#L421
  let params = props[eventName + 'EventParams'];
  return node.addEvent(eventName, eventHandler, params);
}

export function removeEventListener(node, eventName, eventHandler) {
  if (isWeexV2) {
    return DriverDOM.removeEventListener(node, eventName, eventHandler);
  }
  return node.removeEvent(eventName, eventHandler);
}

export function removeAttribute(node, propKey, propValue) {
  if (isWeexV2) {
    return DriverDOM.removeAttribute(node, propKey);
  }
  if (propKey == ID) {
    nodeMaps[propValue] = null;
  }
  // Weex native will crash when pass null value
  return node.setAttr(propKey, undefined, false);
}

export function setAttribute(node, propKey, propValue, isSvg) {
  if (isWeexV2) {
    return DriverDOM.setAttribute(node, propKey, propValue, isSvg);
  }
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
  if (isWeexV2) {
    return DriverDOM.setStyle(node, style, true);
  }
  for (let prop in style) {
    // Translate `rpx` to weex `px`
    style[prop] = convertUnit(style[prop], prop);
  }
  node.setStyles(style);
}

export function beforeRender() {
  // Turn off batched updates
  weexDocument.open();

  // Set `rpx` unit converter
  setRpx(1);
}

export function afterRender() {
  if (weexDocument.listener && weexDocument.listener.createFinish) {
    weexDocument.listener.createFinish();
  }

  // Turn on batched updates
  weexDocument.close();
}
