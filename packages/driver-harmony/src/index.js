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
    const value = node.__children.map(function(child) {
      // Comment node type
      return child.__type === 'comment' ? child.value : EMPTY;
    }).join(EMPTY);

    node.setAttr('value', value);
  },

  createElement(type, props) {
    const node = document.createElement(type, {
      style: props && props.style,
    });

    this.setNativeProps(node, props, true);

    // Mark not rendered into document, this will be removed when harmony supports append into parent which isn't rendered
    node.__rendered = false;
    node.__children = [];

    return node;
  },

  appendChild(node, parent) {
    // For compat harmony not support append into parent which isn't rendered
    if (parent.__rendered) {
      this.aceAppendChildren(node, parent);
    } else {
      // Collect child node
      parent.__children.push(node);
    }

    if (parent.type === TEXT) {
      this.updateTextValue(parent);
    }
  },

  aceAppendChildren(node, parent) {
    this.aceAppendChild(node, parent);
    node.__children.forEach((child) => {
      this.aceAppendChildren(child, node);
    });
  },

  aceAppendChild(node, parent) {
    if (!node.__rendered) {
      parent.appendChild(node);
      node.__rendered = true;
    }
  },

  removeChild(node, parent) {
    parent = parent || node.parentNode;
    let id = node.attr && node.attr[ID];
    if (id != null) {
      this.nodeMaps[id] = null;
    }

    if (parent.__rendered) {
      parent.removeChild(node);
      parent.__children = parent.children;
    } else {
      const childIndex = findIndex(parent.__children, node);
      parent.__children = [...parent.__children.slice(0, childIndex), ...parent.__children.slice(childIndex + 1)];
    }

    if (parent.type === TEXT) {
      this.updateTextValue(parent);
    }
  },

  replaceChild(newChild, oldChild, parent) {
    parent = parent || oldChild.parentNode;

    let previousSibling;
    let nextSibling;

    if (parent.__rendered) {
      previousSibling = oldChild.previousSibling;
      nextSibling = oldChild.nextSibling;
      this.removeChild(oldChild, parent);
      parent.__children = parent.children;
    } else {
      const index = findIndex(parent.__children, oldChild);
      previousSibling = parent.__children[index - 1];
      nextSibling = parent.__children[index + 1];
      // Remove the item
      parent.__children.splice(index, 1);
    }

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
    if (parent.__rendered) {
      parent.insertAfter(node, after);
      parent.__children = parent.children;
    } else {
      const afterChildIndex = findIndex(parent.__children, after);
      parent.__children.splice(afterChildIndex + 1, 0, node);
    }

    if (parent.type === TEXT) {
      this.updateTextValue(parent);
    }
  },

  insertBefore(node, before, parent) {
    parent = parent || before.parentNode;
    if (parent.__rendered) {
      parent.insertBefore(node, before);
      parent.__children = parent.children;
    } else {
      const beforeChildIndex = findIndex(parent.__children, before);
      parent.__children.splice(beforeChildIndex, 0, node);
    }

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

function findIndex(children, target) {
  let childIndex = -1;
  children.some((child, index) => {
    if (child === target) {
      childIndex = index;
      return true;
    }
    return false;
  });
  return childIndex;
}


export default Driver;
