/**
 * Web Browser driver
 **/

import setNativeProps from '../setNativeProps';
import {convertUnit, setRem} from '../style/unit';
import flexbox from '../style/flexbox';

const FULL_WIDTH_REM = 750;
const STYLE = 'style';
const DANGEROUSLY_SET_INNER_HTML = 'dangerouslySetInnerHTML';
const CLASS_NAME = 'className';
const CLASS = 'class';

const Driver = {
  getElementById(id) {
    return document.getElementById(id);
  },

  getChildNodes(node) {
    return node.childNodes;
  },

  createBody() {
    return document.body;
  },

  createFragment() {
    return document.createDocumentFragment();
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

    setNativeProps(node, props);

    return node;
  },

  appendChild(node, parent) {
    return parent.appendChild(node);
  },

  removeChild(node, parent) {
    // TODO, maybe has been removed when remove child
    if (node.parentNode === parent) {
      parent.removeChild(node);
    }
  },

  replaceChild(newChild, oldChild, parent) {
    parent.replaceChild(newChild, oldChild);
  },

  insertAfter(node, after, parent) {
    const nextSibling = after.nextSibling;
    if (nextSibling) {
      parent.insertBefore(node, nextSibling);
    } else {
      parent.appendChild(node);
    }
  },

  insertBefore(node, before, parent) {
    parent.insertBefore(node, before);
  },

  addEventListener(node, eventName, eventHandler) {
    return node.addEventListener(eventName, eventHandler);
  },

  removeEventListener(node, eventName, eventHandler) {
    return node.removeEventListener(eventName, eventHandler);
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
      node[propKey] = null;
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
      node[propKey] = propValue;
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
        transformValue.forEach((value) => {
          node.style[prop] = value;
        });
      } else {
        node.style[prop] = transformValue;
      }
    }
  },

  beforeRender() {
    // Init rem unit
    setRem(this.getWindowWidth() / FULL_WIDTH_REM);
  },

  getWindowWidth() {
    return document.documentElement.clientWidth;
  },
};

export default Driver;
