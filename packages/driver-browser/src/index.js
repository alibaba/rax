/**
 * Web Browser driver
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

const Driver = {

  tagNamePrefix: '',
  deviceWidth: typeof DEVICE_WIDTH !== 'undefined' && DEVICE_WIDTH || null,
  viewportWidth: typeof VIEWPORT_WIDTH !== 'undefined' && VIEWPORT_WIDTH || 750,
  eventRegistry: {},

  setTagNamePrefix(prefix) {
    this.tagNamePrefix = prefix;
  },

  getDeviceWidth() {
    return this.deviceWidth || document.documentElement.clientWidth;
  },

  setDeviceWidth(width) {
    this.deviceWidth = width;
  },

  getViewportWidth() {
    return this.viewportWidth;
  },

  setViewportWidth(width) {
    this.viewportWidth = width;
  },

  getElementById(id) {
    return document.getElementById(id);
  },

  createBody() {
    return document.body;
  },

  createComment(content) {
    return document.createComment(content);
  },

  createEmpty() {
    return this.createComment(' empty ');
  },

  createText(text) {
    return document.createTextNode(text);
  },

  updateText(node, text) {
    node[TEXT_CONTENT_ATTR] = text;
  },

  // driver's flag indicating if the diff is currently within an SVG
  isSVGMode: false,

  createElement(component) {
    const parent = component._internal._parent;
    this.isSVGMode = component.type === 'svg' || parent && parent.namespaceURI === SVG_NS;

    let node;
    if (this.isSVGMode) {
      node = document.createElementNS(SVG_NS, component.type);
    } else {
      node = document.createElement(this.tagNamePrefix + component.type);
    }

    let props = component.props;
    this.setNativeProps(node, props);

    return node;
  },

  appendChild(node, parent) {
    return parent.appendChild(node);
  },

  removeChild(node, parent) {
    parent = parent || node.parentNode;
    // Maybe has been removed when remove child
    if (parent) {
      parent.removeChild(node);
    }
  },

  replaceChild(newChild, oldChild, parent) {
    parent = parent || oldChild.parentNode;
    parent.replaceChild(newChild, oldChild);
  },

  insertAfter(node, after, parent) {
    parent = parent || after.parentNode;
    const nextSibling = after.nextSibling;
    if (nextSibling) {
      parent.insertBefore(node, nextSibling);
    } else {
      parent.appendChild(node);
    }
  },

  insertBefore(node, before, parent) {
    parent = parent || before.parentNode;
    parent.insertBefore(node, before);
  },

  addEventListener(node, eventName, eventHandler, props) {
    if (this.eventRegistry[eventName]) {
      return this.eventRegistry[eventName](ADD_EVENT, node, eventName, eventHandler, props);
    } else {
      return node.addEventListener(eventName, eventHandler);
    }
  },

  removeEventListener(node, eventName, eventHandler, props) {
    if (this.eventRegistry[eventName]) {
      return this.eventRegistry[eventName](REMOVE_EVENT, node, eventName, eventHandler, props);
    } else {
      return node.removeEventListener(eventName, eventHandler);
    }
  },

  removeAllEventListeners(node) {
    // noop
  },

  removeAttribute(node, propKey) {
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
  },

  setAttribute(node, propKey, propValue) {
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
  },

  setStyles(node, styles) {
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
  },

  beforeRender() {
    // Init rem unit
    setRem(this.getDeviceWidth() / this.getViewportWidth());
  },

  setNativeProps(node, props) {
    for (let prop in props) {
      let value = props[prop];
      if (prop === CHILDREN) {
        continue;
      }

      if (value != null) {
        if (prop === STYLE) {
          this.setStyles(node, value);
        } else if (EVENT_PREFIX_REGEXP.test(prop)) {
          let eventName = prop.slice(2).toLowerCase();
          this.addEventListener(node, eventName, value);
        } else {
          this.setAttribute(node, prop, value);
        }
      }
    }
  }
};

export default Driver;
