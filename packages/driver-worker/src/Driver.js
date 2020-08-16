import { convertUnit, setDecimalPixelTransformer, setRpx } from 'style-unit';

const CLASS_NAME = 'className';
const CLASS = 'class';
const STYLE = 'style';
const CHILDREN = 'children';
const EVENT_PREFIX_REGEXP = /^on[A-Z]/;
const ADD_EVENT = 'addEvent';
const REMOVE_EVENT = 'removeEvent';
const EMPTY_CONTENT = '';

/**
 * Implement rax driver interface for worker driver
 */
export default class Driver {
  deviceWidth = null;
  viewportWidth = 750;
  eventRegistry = {};

  constructor(document) {
    this.document = document;
  }

  getDeviceWidth() {
    return this.deviceWidth || this.document.documentElement.clientWidth;
  }

  setDeviceWidth(width) {
    this.deviceWidth = width;
  }

  getViewportWidth() {
    return this.viewportWidth;
  }

  setViewportWidth(width) {
    this.viewportWidth = width;
  }

  getElementById(id) {
    return this.document.getElementById(id);
  }

  createBody() {
    const { document } = this;
    return document.body;
  }

  createComment(content) {
    const { document } = this;
    return document.createComment(content);
  }

  createEmpty() {
    return this.createComment(EMPTY_CONTENT);
  }

  createText(text) {
    return this.document.createTextNode(text);
  }

  updateText(node, text) {
    node.textContent = text;
  }

  createElement(component) {
    let node = this.document.createElement(component.type);
    let props = component.props;

    this.setNativeProps(node, props);

    return node;
  }

  appendChild(node, parent) {
    return parent.appendChild(node);
  }

  removeChild(node, parent) {
    parent = parent || node.parentNode;
    // Maybe has been removed when remove child
    if (parent) {
      parent.removeChild(node);
    }
  }

  replaceChild(newChild, oldChild, parent) {
    parent = parent || oldChild.parentNode;
    if (parent) parent.replaceChild(newChild, oldChild);
  }

  insertAfter(node, after, parent) {
    parent = parent || after.parentNode;
    const nextSibling = after.nextSibling;
    if (nextSibling) {
      parent.insertBefore(node, nextSibling);
    } else {
      parent.appendChild(node);
    }
  }

  insertBefore(node, before, parent) {
    parent = parent || before.parentNode;
    parent.insertBefore(node, before);
  }

  addEventListener(node, eventName, eventHandler, props) {
    if (this.eventRegistry[eventName]) {
      return this.eventRegistry[eventName](
        ADD_EVENT,
        node,
        eventName,
        eventHandler,
        props
      );
    } else {
      return node.addEventListener(eventName, eventHandler);
    }
  }

  removeEventListener(node, eventName, eventHandler, props) {
    if (this.eventRegistry[eventName]) {
      return this.eventRegistry[eventName](
        REMOVE_EVENT,
        node,
        eventName,
        eventHandler,
        props
      );
    } else {
      return node.removeEventListener(eventName, eventHandler);
    }
  }

  removeAllEventListeners(node) {
    node._eventListeners = {};
  }

  removeAttribute(node, propKey) {
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

  setAttribute(node, propKey, propValue) {
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

  setStyles(node, styles) {
    let newStyles = node.style;

    for (let prop in styles) {
      let val = styles[prop];
      newStyles[prop] = convertUnit(val, prop);
    }
    // Assign to style for trigger style update
    node.style = newStyles;
  }

  beforeRender() {
    // Init rem unit
    const rpxRadio = this.getDeviceWidth() / this.getViewportWidth();
    setRpx(rpxRadio);
    setDecimalPixelTransformer((rpx) => Math.floor(parseFloat(rpx) * rpxRadio) + 'px');
  }

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
}
