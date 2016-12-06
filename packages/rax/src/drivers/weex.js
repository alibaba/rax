/**
 * Weex driver
 **/

import Host from '../vdom/host';
import setNativeProps from '../setNativeProps';
import {convertUnit, setRem} from '../style/unit';

const STYLE = 'style';
const ID = 'id';
const TEXT = 'text';
const FULL_WIDTH_REM = 750;
const DOCUMENT_FRAGMENT_NODE = 11;

const nodeMaps = {};

const Driver = {
  getElementById(id) {
    return nodeMaps[id];
  },

  createBody() {
    // Close batched updates
    Host.document.open();

    if (Host.document.body) {
      return Host.document.body;
    }

    let documentElement = Host.document.documentElement;
    let body = Host.document.createBody();
    documentElement.appendChild(body);

    return body;
  },

  createFragment() {
    return {
      nodeType: DOCUMENT_FRAGMENT_NODE,
      childNodes: []
    };
  },

  createComment(content) {
    return Host.document.createComment(content);
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
    let props = component.props;
    let events = [];
    let style = {};
    let originStyle = props[STYLE];
    for (let prop in originStyle) {
      style[prop] = convertUnit(originStyle[prop], prop);
    }

    let node = Host.document.createElement(component.type, {
      style,
    });

    setNativeProps(node, props, true);

    return node;
  },

  appendChild(node, parent) {
    if (parent.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return parent.childNodes.push(node);
    } else if (node.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return node.childNodes.map(child => {
        return this.appendChild(child, parent);
      });
    } else {
      return parent.appendChild(node);
    }
  },

  removeChild(node, parent) {
    let id = node.attr && node.attr[ID];
    if (id != null) {
      nodeMaps[id] = null;
    }
    return parent.removeChild(node);
  },

  replaceChild(newChild, oldChild, parent) {
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
    if (node.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return node.childNodes.map((child, index) => {
        return this.insertAfter(child, node.childNodes[index - 1] || after, parent);
      });
    } else {
      return parent.insertAfter(node, after);
    }
  },

  insertBefore(node, before, parent) {
    if (node.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return node.childNodes.map((child, index) => {
        return this.insertBefore(child, before, parent);
      });
    } else {
      return parent.insertBefore(node, before);
    }
  },

  addEventListener(node, eventName, eventHandler) {
    return node.addEvent(eventName, eventHandler);
  },

  removeEventListener(node, eventName, eventHandler) {
    return node.removeEvent(eventName, eventHandler);
  },

  removeAllEventListeners(node) {
    // noop
  },

  removeAttribute(node, propKey, propValue) {
    if (propKey == ID) {
      nodeMaps[propValue] = null;
    }
    // Weex native will crash when pass null value
    return node.setAttr(propKey, undefined);
  },

  setAttribute(node, propKey, propValue) {
    if (propKey == ID) {
      nodeMaps[propValue] = node;
    }

    return node.setAttr(propKey, propValue);
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
    // Init rem unit
    setRem(this.getWindowWidth() / FULL_WIDTH_REM);
  },

  afterRender() {
    if (Host.document && Host.document.listener && Host.document.listener.createFinish) {
      Host.document.listener.createFinish(
        () => {
          // Make updates batched
          Host.document.close();
        }
      );
    }
  },

  getWindowWidth() {
    return FULL_WIDTH_REM;
  },
};

export default Driver;
