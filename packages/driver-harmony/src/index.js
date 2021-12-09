import { convertUnit, setTargetPlatform } from 'style-unit';

/**
 *  Server driver
 **/
const ID = 'id';
const STYLE = 'style';
const CHILDREN = 'children';
const EVENT_PREFIX_REGEXP = /^on[A-Z]/;
const REF = 'ref';

const TEXT = 'text';
const EMPTY = '';

setTargetPlatform('harmony');

const Driver = {
  // Internal state
  nodeMaps: {},

  getElementById(id) {
    return this.nodeMaps[id];
  },

  createBody() {
    return document.body;
  },

  createComment() {
    // Use block element as comment node, because harmony not support append comment node
    const node = this.createElement('block');
    node.__type = 'comment';
    return node;
  },

  createEmpty() {
    return this.createComment(EMPTY);
  },

  createText(text) {
    // Use comment node type mock text node
    const node = this.createComment(EMPTY);
    node.value = text;
    return node;
  },

  updateText(node, text) {
    node.value = text;
    this.updateTextValue(node.parentNode);
  },

  updateTextValue(node) {
    const value = node.children.map(function(child) {
      // Comment node type
      return child.__type === 'comment' ? child.value : EMPTY;
    }).join(EMPTY);

    node.setAttr('value', value);
  },

  createElement(type, props) {
    props = props || {};
    const style = {};
    const originStyle = props.style;
    if (originStyle) {
      for (let prop in originStyle) {
        style[prop] = convertUnit(originStyle[prop], prop);
      }
    }

    const node = document.createElement(type, {
      style,
    });

    this.setNativeProps(node, props, true);

    return node;
  },

  appendChild(node, parent) {
    parent.appendChild(node);

    if (parent.type === TEXT) {
      this.updateTextValue(parent);
    }
  },

  aceAppendChildren(node, parent) {
    this.aceAppendChild(node, parent);
  },

  removeChild(node, parent) {
    parent = parent || node.parentNode;
    let id = node.attr && node.attr[ID];
    if (id != null) {
      this.nodeMaps[id] = null;
    }

    parent.removeChild(node);

    if (parent.type === TEXT) {
      this.updateTextValue(parent);
    }
  },

  replaceChild(newChild, oldChild, parent) {
    parent = parent || oldChild.parentNode;

    let previousSibling;
    let nextSibling;

    previousSibling = oldChild.previousSibling;
    nextSibling = oldChild.nextSibling;
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
    parent.insertAfter(node, after);


    if (parent.type === TEXT) {
      this.updateTextValue(parent);
    }
  },

  insertBefore(node, before, parent) {
    parent = parent || before.parentNode;
    parent.insertBefore(node, before);

    if (parent.type === TEXT) {
      this.updateTextValue(parent);
    }
  },

  addEventListener(node, eventName, eventHandler) {
    node.addEvent(eventName, eventHandler);
  },

  removeEventListener(node, eventName, eventHandler) {
    node.removeEvent(eventName, eventHandler);
  },

  removeAttribute(node, propKey, propValue) {
    if (propKey === ID) {
      this.nodeMaps[propValue] = null;
    }
    return node.setAttr(propKey, undefined, false);
  },

  setAttribute(node, propKey, propValue) {
    if (propKey === ID) {
      this.nodeMaps[propValue] = node;
    }
    // ref is harmony node internal key
    if (propKey === REF) return;
    return node.setAttr(propKey, propValue);
  },

  setStyle(node, style) {
    for (let prop in style) {
      // Translate `rpx` to weex `px`
      style[prop] = convertUnit(style[prop], prop);
    }
    node.setStyles(style);
  },

  setNativeProps(node, props, shouldIgnoreStyleProp) {
    for (let prop in props) {
      let value = props[prop];
      if (prop === CHILDREN) {
        continue;
      }

      if (value != null) {
        if (prop === STYLE) {
          if (shouldIgnoreStyleProp) {
            continue;
          }
          this.setStyle(node, value);
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
