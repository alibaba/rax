/**
 * Weex driver
 */
import {convertUnit, setRem} from 'style-unit';
import w3cElements from './elements';

const STYLE = 'style';
const ID = 'id';
const TEXT = 'text';
const CHILDREN = 'children';
const EVENT_PREFIX_REGEXP = /^on[A-Z]/;
const ARIA_PREFIX_REGEXP = /^aria-/;

const nodeMaps = {};
/* global __weex_document__ */
const document = typeof __weex_document__ === 'object' ?
  __weex_document__ : typeof document === 'object' ?
    document : null;

const Driver = {
  deviceWidth: 750,
  viewportWidth: 750,

  getDeviceWidth() {
    return this.deviceWidth;
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
    return nodeMaps[id];
  },

  createBody() {
    if (document.body) {
      return document.body;
    }

    let documentElement = document.documentElement;
    let body = document.createBody();
    documentElement.appendChild(body);

    return body;
  },

  createComment(content) {
    return document.createComment(content);
  },

  createEmpty() {
    return this.createComment(' empty ');
  },

  createText(text) {
    return Driver.createElement({
      type: TEXT,
      props: {
        value: text,
      }
    });
  },

  updateText(node, content) {
    this.setAttribute(node, 'value', content);
  },

  createElement(component) {
    const htmlElement = w3cElements[component.type];
    if (htmlElement) {
      component = htmlElement.parse(component);
    }

    let props = component.props;
    let events = [];
    let style = {};
    let originStyle = props[STYLE];
    for (let prop in originStyle) {
      style[prop] = convertUnit(originStyle[prop], prop);
    }

    let node = document.createElement(component.type, {
      style,
    });

    this.setNativeProps(node, props, true);

    return node;
  },

  appendChild(node, parent) {
    return parent.appendChild(node);
  },

  removeChild(node, parent) {
    parent = parent || node.parentNode;
    let id = node.attr && node.attr[ID];
    if (id != null) {
      nodeMaps[id] = null;
    }
    return parent.removeChild(node);
  },

  replaceChild(newChild, oldChild, parent) {
    parent = parent || oldChild.parentNode;
    let previousSibling = oldChild.previousSibling;
    let nextSibling = oldChild.nextSibling;
    this.removeChild(oldChild, parent);

    if (previousSibling) {
      this.insertAfter(newChild, previousSibling, parent);
    } else if (nextSibling) {
      this.insertBefore(newChild, nextSibling, parent);
    } else {
      this.appendChild(newChild, parent);
    }
  },

  insertAfter(node, after, parent) {
    parent = parent || after.parentNode;
    return parent.insertAfter(node, after);
  },

  insertBefore(node, before, parent) {
    parent = parent || before.parentNode;
    return parent.insertBefore(node, before);
  },

  addEventListener(node, eventName, eventHandler) {
    return node.addEvent(eventName, eventHandler);
  },

  removeEventListener(node, eventName, eventHandler) {
    return node.removeEvent(eventName, eventHandler);
  },

  removeAllEventListeners(node) {
    // Noop
  },

  removeAttribute(node, propKey, propValue) {
    if (propKey == ID) {
      nodeMaps[propValue] = null;
    }
    // Weex native will crash when pass null value
    return node.setAttr(propKey, undefined, false);
  },

  setAttribute(node, propKey, propValue) {
    if (propKey == ID) {
      nodeMaps[propValue] = node;
    }

    // Weex only support `ariaLabel` format, convert `aria-label` format to camelcase
    if (ARIA_PREFIX_REGEXP.test(propKey)) {
      propKey = propKey.replace(/\-(\w)/, function(m, p1) {
        return p1.toUpperCase();
      });
    }

    return node.setAttr(propKey, propValue, false);
  },

  setStyles(node, styles) {
    // TODO if more then one style update, call setStyles will be better performance
    for (let key in styles) {
      let val = styles[key];
      val = convertUnit(val, key);
      node.setStyle(key, val);
    }
  },

  beforeRender() {
    // Turn off batched updates
    document.open();

    // Init rem unit
    setRem( this.getDeviceWidth() / this.getViewportWidth() );
  },

  afterRender() {
    if (document.listener && document.listener.createFinish) {
      document.listener.createFinish();
    }

    // Turn on batched updates
    document.close();
  },

  setNativeProps(node, props, skipSetStyles) {
    for (let prop in props) {
      let value = props[prop];
      if (prop === CHILDREN) {
        continue;
      }

      if (value != null) {
        if (prop === STYLE) {
          if (skipSetStyles) {
            continue;
          }
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
