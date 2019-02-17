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
const ADD_EVENT = 'addEvent';
const REMOVE_EVENT = 'removeEvent';
const TEXT_CONTENT_ATTR = typeof document === 'object' && 'textContent' in document ? 'textContent' : 'nodeValue';

const getClientWidth = () => document.documentElement.clientWidth;

let tagNamePrefix = '';
let deviceWidth = typeof DEVICE_WIDTH !== 'undefined' && DEVICE_WIDTH || null;
let viewportWidth = typeof VIEWPORT_WIDTH !== 'undefined' && VIEWPORT_WIDTH || null;

const eventRegistry = {
  change: function(eventType, node, eventName, eventHandler, props) {
    let tagName = node.tagName.toLowerCase();

    if (
      tagName === 'textarea' ||
      tagName === 'input' && (!props.type || props.type === 'text' || props.type === 'password')
    ) {
      eventName = 'input';
    }

    if (eventType === ADD_EVENT) {
      return node.addEventListener(eventName, eventHandler);
    } else {
      return node.removeEventListener(eventName, eventHandler);
    }
  },
  doubleclick: function(eventType, node, eventName, eventHandler, props) {
    eventName = 'dblclick';

    if (eventType === ADD_EVENT) {
      return node.addEventListener(eventName, eventHandler);
    } else {
      return node.removeEventListener(eventName, eventHandler);
    }
  }
};

export function setTagNamePrefix(prefix) {
  tagNamePrefix = prefix;
}

function getDeviceWidth() {
  return deviceWidth || getClientWidth();
}

export function setDeviceWidth(width) {
  deviceWidth = width;
}

function getViewportWidth() {
  return viewportWidth || getClientWidth();
}

export function setViewportWidth(width) {
  viewportWidth = width;
}

export function getElementById(id) {
  return document.getElementById(id);
}

export function createBody() {
  return document.body;
}

export function createComment(content) {
  return document.createComment(content);
}

export function createEmpty() {
  return createComment(' empty ');
}

export function createText(text) {
  return document.createTextNode(text);
}

export function updateText(node, text) {
  node[TEXT_CONTENT_ATTR] = text;
}

// driver's flag indicating if the diff is currently within an SVG
let isSVGMode = false;

export function createElement(component) {
  const parent = component._internal._parent;
  isSVGMode = component.type === 'svg' || parent && parent.namespaceURI === SVG_NS;

  let node;
  if (isSVGMode) {
    node = document.createElementNS(SVG_NS, component.type);
  } else if (tagNamePrefix) {
    let tagNamePrefix = typeof tagNamePrefix === 'function' ? tagNamePrefix(component.type) : tagNamePrefix;
    node = document.createElement(tagNamePrefix + component.type);
  } else {
    node = document.createElement(component.type);
  }

  let props = component.props;
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
    // Performance improve when node has been existed before nextSibing
    if (nextSibling !== node) {
      parent.insertBefore(node, nextSibling);
    }
  } else {
    parent.appendChild(node);
  }
}

export function insertBefore(node, before, parent) {
  parent = parent || before.parentNode;
  parent.insertBefore(node, before);
}

export function addEventListener(node, eventName, eventHandler, props) {
  if (eventRegistry[eventName]) {
    return eventRegistry[eventName](ADD_EVENT, node, eventName, eventHandler, props);
  } else {
    return node.addEventListener(eventName, eventHandler);
  }
}

export function removeEventListener(node, eventName, eventHandler, props) {
  if (eventRegistry[eventName]) {
    return eventRegistry[eventName](REMOVE_EVENT, node, eventName, eventHandler, props);
  } else {
    return node.removeEventListener(eventName, eventHandler);
  }
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

function setStyles(node, styles) {
  let tranformedStyles = {};

  for (let prop in styles) {
    let val = styles[prop];
    if (flexbox.isFlexProp(prop)) {
      flexbox[prop](val, tranformedStyles);
    } else {
      tranformedStyles[prop] = convertUnit(val, prop);
    }
  }

  for (let prop in tranformedStyles) {
    const transformValue = tranformedStyles[prop];
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

export function beforeRender() {
  // Init rem unit
  setRem(getDeviceWidth() / getViewportWidth());
}

export function setNativeProps(node, props) {
  for (let prop in props) {
    let value = props[prop];
    if (prop === CHILDREN) {
      continue;
    }

    if (value != null) {
      if (prop === STYLE) {
        setStyles(node, value);
      } else if (EVENT_PREFIX_REGEXP.test(prop)) {
        let eventName = prop.slice(2).toLowerCase();
        addEventListener(node, eventName, value);
      } else {
        setAttribute(node, prop, value);
      }
    }
  }
}

