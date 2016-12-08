/**
 * Web Browser driver
 **/

import setNativeProps from '../setNativeProps';
import {convertUnit, setRem} from '../style/unit';
import flexbox from '../style/flexbox';

const FULL_WIDTH_REM = 750;
const STYLE = 'style';
const DANGEROUSLY_SET_INNER_HTML = 'dangerouslySetInnerHTML';

const Driver = {
  getElementById(id) {
    return document.getElementById(id);
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
    // TODO
  },

  removeAttribute(node, propKey) {
    if (propKey === 'className') {
      propKey = 'class';
    }

    if (node.nodeName.toLowerCase() == 'input' &&
      ( propKey == 'checked' && (node.type === 'checkbox' || node.type === 'radio')
      || propKey == 'value')) {
      node[propKey] = null;
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      node.innerHTML = null;
    } else {
      node.removeAttribute(propKey);
    }
  },

  setAttribute(node, propKey, propValue) {
    if (propKey === 'className') {
      propKey = 'class';
    }

    if (node.nodeName.toLowerCase() == 'input' &&
      ( propKey == 'checked' && (node.type === 'checkbox' || node.type === 'radio')
      || propKey == 'value')) {
      node[propKey] = propValue;
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      node.innerHTML = propValue.__html;
    } else if (propValue != null) {
      node.setAttribute(propKey, propValue);
    }
  },

  setStyles(node, styles) {
    for (let prop in styles) {
      if (styles.hasOwnProperty(prop)) {
        let val = styles[prop];
        if (flexbox.isFlexProp(prop)) {
          flexbox[prop](val, node.style);
        } else {
          node.style[prop] = convertUnit(val, prop);
        }
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
