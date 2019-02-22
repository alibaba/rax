/**
 * Driver for Web DOM
 **/

/* global DEVICE_WIDTH, VIEWPORT_WIDTH */

import { convertUnit, setRem } from 'style-unit';
import flexbox from './flexbox';

const DANGEROUSLY_SET_INNER_HTML = 'dangerouslySetInnerHTML';
const CLASS_NAME = 'className';
const CLASS = 'class';
const STYLE = 'style';
const CHILDREN = 'children';
const EVENT_PREFIX_REGEXP = /^on[A-Z]/;
const SVG_NS = 'http://www.w3.org/2000/svg';
const TEXT_CONTENT_ATTR = typeof document === 'object' && 'textContent' in document ? 'textContent' : 'nodeValue';

const getClientWidth = () => document.documentElement.clientWidth;

let tagNamePrefix = '';
let deviceWidth = null;
let viewportWidth = null;
// driver's flag indicating if the diff is currently within an SVG
let isSVGMode = false;

export function setTagNamePrefix(prefix) {
  tagNamePrefix = prefix;
}

function getDeviceWidth() {
  return deviceWidth || typeof DEVICE_WIDTH !== 'undefined' && DEVICE_WIDTH || getClientWidth();
}

export function setDeviceWidth(width) {
  deviceWidth = width;
}

function getViewportWidth() {
  return viewportWidth || typeof VIEWPORT_WIDTH !== 'undefined' && VIEWPORT_WIDTH || getClientWidth();
}

export function setViewportWidth(width) {
  viewportWidth = width;
}

export function createBody() {
  return document.body;
}

export function createEmpty(component) {
  return document.createComment(' _ ');
}

export function createText(text, component) {
  return document.createTextNode(text);
}

export function updateText(node, text) {
  node[TEXT_CONTENT_ATTR] = text;
}

export function createElement(type, props, component) {
  const parent = component._parent;
  isSVGMode = type === 'svg' || parent && parent.namespaceURI === SVG_NS;

  let node;
  if (isSVGMode) {
    node = document.createElementNS(SVG_NS, type);
  } else if (tagNamePrefix) {
    let tagNamePrefix = typeof tagNamePrefix === 'function' ? tagNamePrefix(type) : tagNamePrefix;
    node = document.createElement(tagNamePrefix + type);
  } else {
    node = document.createElement(type);
  }

  setNativeProps(node, props);

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

function normalizeEventName(node, eventName, component) {
  const tagName = node.tagName.toLowerCase();
  const instance = component._instance;
  const props = instance.props;

  if (
    eventName === 'change' &&
    (tagName === 'textarea' ||
    tagName === 'input' && (!props.type || props.type === 'text' || props.type === 'password'))
  ) {
    eventName = 'input';
  } else if (eventName === 'doubleclick') {
    eventName = 'dblclick';
  }
  return eventName;
}

export function addEventListener(node, eventName, eventHandler, component) {
  eventName = normalizeEventName(node, eventName, component);
  return node.addEventListener(eventName, eventHandler);
}

export function removeEventListener(node, eventName, eventHandler, component) {
  eventName = normalizeEventName(node, eventName, component);
  return node.removeEventListener(eventName, eventHandler);
}

export function removeAttribute(node, propKey) {
  if (propKey === DANGEROUSLY_SET_INNER_HTML) {
    return node.innerHTML = null;
  }

  if (propKey === CLASS_NAME) {
    propKey = CLASS;
  }

  if (propKey in node) {
    try {
      // Some node property is readonly when in strict mode
      node[propKey] = null;
    } catch (e) { }
  }

  node.removeAttribute(propKey);
}

export function setAttribute(node, propKey, propValue) {
  if (propKey === DANGEROUSLY_SET_INNER_HTML) {
    return node.innerHTML = propValue.__html;
  }

  if (propKey === CLASS_NAME) {
    propKey = CLASS;
  }

  if (propKey in node) {
    try {
      // Some node property is readonly when in strict mode
      node[propKey] = propValue;
    } catch (e) {
      node.setAttribute(propKey, propValue);
    }
  } else {
    node.setAttribute(propKey, propValue);
  }
}

export function beforeRender() {
  // Init rem unit
  setRem(getDeviceWidth() / getViewportWidth());
}

export function setStyle(node, style) {
  let tranformedStyle = {};

  for (let prop in style) {
    let val = style[prop];
    if (flexbox.isFlexProp(prop)) {
      flexbox[prop](val, tranformedStyle);
    } else {
      tranformedStyle[prop] = convertUnit(val, prop);
    }
  }

  for (let prop in tranformedStyle) {
    const transformValue = tranformedStyle[prop];
    // hack handle compatibility issue
    if (Array.isArray(transformValue)) {
      for (let i = 0; i < transformValue.length; i++) {
        node.style[prop] = transformValue[i];
      }
    } else {
      node.style[prop] = transformValue;
    }
  }
}

function setNativeProps(node, props) {
  for (let prop in props) {
    let value = props[prop];
    if (prop === CHILDREN) {
      continue;
    }

    if (value != null) {
      if (prop === STYLE) {
        setStyle(node, value);
      } else if (EVENT_PREFIX_REGEXP.test(prop)) {
        let eventName = prop.slice(2).toLowerCase();
        addEventListener(node, eventName, value);
      } else {
        setAttribute(node, prop, value);
      }
    }
  }
}

