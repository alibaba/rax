/**
 * Web Browser driver
 **/

/* global DEVICE_WIDTH, VIEWPORT_WIDTH */

import { convertUnit, setRem } from 'style-unit';
import flexbox from './flexbox';
import {
  mustUseProperty,
  isNumbericProperty,
  isStrictBooleanProperty,
  isBooleanProperty,
  isAcceptableAttribute,
  normalizeAttributeName,
  normalizePropertyName,
  isReservedProp
} from './properties';

const DANGEROUSLY_SET_INNER_HTML = 'dangerouslySetInnerHTML';
const CLASS_NAME = 'className';
const CLASS = 'class';
const STYLE = 'style';
const CHILDREN = 'children';
const EVENT_PREFIX_REGEXP = /on[A-Z]/;

const ADD_EVENT = 'addEvent';
const REMOVE_EVENT = 'removeEvent';

const Driver = {

  deviceWidth: typeof DEVICE_WIDTH !== 'undefined' && DEVICE_WIDTH || null,
  viewportWidth: typeof VIEWPORT_WIDTH !== 'undefined' && VIEWPORT_WIDTH || 750,
  eventRegistry: {},

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
    let textContentAttr = 'textContent' in document ? 'textContent' : 'nodeValue';
    node[textContentAttr] = text;
  },

  createElement(component) {
    let node = document.createElement(component.type);
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
    parent.removeChild(node);
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

    node.removeAttribute(normalizeAttributeName(propKey));
  },

  setAttribute(node, propKey, propValue) {
    if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      // in case propValue is not a plain object
      node.innerHTML = { ...propValue }.__html;
      return;
    }

    // check property name writeable
    if (this.shouldSetAttribute(propKey, propValue)) {
      if (
        propValue === null ||
        (isBooleanProperty(propKey) && propValue == null || propValue === false) ||
        isNumbericProperty(propKey) && isNaN(propValue) ||
        isStrictBooleanProperty(propKey) && propValue === false
      ) {
        // delete property value from node
        this.removeProperty(node, propKey);
      } else if (mustUseProperty(propKey)) {
        // must use property
        this.setProperty(node, propKey, propValue);
      } else {
        // set attribute
        this.setDOMAttribute(node, propKey, propValue);
      }
    } else {
      this.removeAttribute(node, propKey);
    }
  },

  setDOMAttribute(node, propKey, propValue) {
    const attributeName = normalizeAttributeName(propKey);
    // `setAttribute` with objects becomes only `[object]` in IE8/9,
    // ('' + propValue) makes it output the correct toString()-value.
    if (
      isBooleanProperty(propKey) ||
      isStrictBooleanProperty(propKey) && propValue === true
    ) {
      // if attributeName is `required`, it becomes `<input required />`
      node.setAttribute(attributeName, '');
    } else {
      node.setAttribute(attributeName, '' + propValue);
    }
  },

  removeProperty(node, propKey) {
    // in write list
    if (isAcceptableAttribute(propKey)) {
      if (mustUseProperty(propKey)) {
        if (isBooleanProperty(propKey)) {
          node[normalizePropertyName(propKey)] = false;
        } else {
          node[normalizePropertyName(propKey)] = '';
        }
      } else {
        node.removeAttribute(normalizeAttributeName(propKey));
      }
    } else {
      node.removeAttribute(normalizeAttributeName(propKey));
    }
  },

  setProperty(node, propKey, propValue) {
    const propertyName = normalizePropertyName(propKey);
    // Contrary to `setAttribute`, object properties are properly
    // `toString`ed by IE8/9.
    node[propertyName] = propValue;
  },

  // check whether a property name is a writeable attribute
  shouldSetAttribute(propKey, propValue) {
    // some reserved props ignored
    if (isReservedProp(propKey)) {
      return false;
    }

    switch (typeof propValue) {
      case 'boolean':
        // that propKey in white list
        if (isAcceptableAttribute(propKey)) {
          return true;
        }
        // data- and aria- pass
        const prefix = propKey.toLowerCase().slice(0, 5);
        return prefix === 'data-' || prefix === 'aria-';
      case 'undefined':
      case 'number':
      case 'string':
      case 'object':
        return true;
      default:
        // function, symbol, and others
        return false;
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
