/**
 *  Server driver
 **/

import setNativeProps from '../setNativeProps';

const ID = 'id';
const STYLE = 'style';
const DANGEROUSLY_SET_INNER_HTML = 'dangerouslySetInnerHTML';

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;
const DOCUMENT_FRAGMENT_NODE = 11;

const Driver = {
  // Internal state
  nodeMaps: {},
  nodeCounter: 0,

  getElementById(id) {
    return this.nodeMaps[id];
  },

  createBody() {
    return {
      nodeType: ELEMENT_NODE,
      tagName: 'BODY',
      attributes: {},
      style: {},
      eventListeners: {},
      childNodes: [],
      parentNode: null
    };
  },

  createFragment() {
    return {
      nodeType: DOCUMENT_FRAGMENT_NODE,
      childNodes: [],
    };
  },

  createComment(content) {
    return {
      nodeType: COMMENT_NODE,
      data: content,
      parentNode: null,
      nodeId: this.nodeCounter++
    };
  },

  createEmpty() {
    return this.createComment(' empty ');
  },

  createText(text) {
    return {
      nodeType: TEXT_NODE,
      data: text,
      parentNode: null,
      nodeId: this.nodeCounter++
    };
  },

  updateText(node, text) {
    node.data = text;
  },

  createElement(component) {
    let props = component.props;
    let node = {
      nodeType: ELEMENT_NODE,
      tagName: component.type.toUpperCase(),
      attributes: {},
      style: props.style || {},
      eventListeners: {},
      childNodes: [],
      parentNode: null,
      nodeId: this.nodeCounter++
    };

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
      parent.childNodes.push(node);
      node.parentNode = parent;
    }
  },

  removeChild(node, parent) {
    let id = node.attributes && node.attributes[ID];
    if (id != null) {
      this.nodeMaps[id] = null;
    }
    if (node.parentNode) {
      let idx = node.parentNode.childNodes.indexOf(node);
      node.parentNode.childNodes.splice(idx, 1);
      node.parentNode = null;
    }
  },

  replaceChild(newChild, oldChild, parent) {
    let previousSibling = this.previousSibling(oldChild);
    let nextSibling = this.nextSibling(oldChild);

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
      let nodeIdx = parent.childNodes.indexOf(node);
      if (nodeIdx !== -1) {
        parent.childNodes.splice(nodeIdx, 1);
      }

      let idx = parent.childNodes.indexOf(after);

      if (idx === parent.childNodes.length - 1) {
        parent.childNodes.push(node);
      } else {
        parent.childNodes.splice(idx + 1, 0, node);
      }
      node.parentNode = parent;
    }
  },

  insertBefore(node, before, parent) {
    if (node.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return node.childNodes.map((child, index) => {
        return this.insertBefore(child, before, parent);
      });
    } else {
      let nodeIdx = parent.childNodes.indexOf(node);
      if (nodeIdx !== -1) {
        parent.childNodes.splice(nodeIdx, 1);
      }

      let idx = parent.childNodes.indexOf(before);
      parent.childNodes.splice(idx, 0, node);
      node.parentNode = parent;
    }
  },

  nextSibling(node) {
    let parentNode = node.parentNode;
    if (parentNode) {
      let idx = parentNode.childNodes.indexOf(node);
      return parentNode.childNodes[idx + 1];
    }
  },

  previousSibling(node) {
    let parentNode = node.parentNode;
    if (parentNode) {
      let idx = parentNode.childNodes.indexOf(node);
      return parentNode.childNodes[idx - 1];
    }
  },

  addEventListener(node, eventName, eventHandler) {
    node.eventListeners[eventName] = eventHandler;
  },

  removeEventListener(node, eventName, eventHandler) {
    delete node.eventListeners[eventName];
  },

  removeAllEventListeners(node) {
    node.eventListeners = {};
  },

  removeAttribute(node, propKey, propValue) {
    if (propKey === 'className') {
      propKey = 'class';
    }

    if (propKey == ID) {
      this.nodeMaps[propValue] = null;
    }

    if (node.tagName === 'INPUT' &&
      ( propKey == 'checked' && (node.attributes.type === 'checkbox' || node.attributes.type === 'radio')
      || propKey == 'value')) {
      node.attributes[propKey] = null;
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      node.__html = null;
    } else {
      node.attributes[propKey] = null;
    }
  },

  setAttribute(node, propKey, propValue) {
    if (propKey === 'className') {
      propKey = 'class';
    }

    if (propKey == ID) {
      this.nodeMaps[propValue] = node;
    }

    if (node.tagName === 'INPUT' &&
      ( propKey == 'checked' && (node.attributes.type === 'checkbox' || node.attributes.type === 'radio')
      || propKey == 'value')) {
      node.attributes[propKey] = propValue;
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      node.__html = propValue.__html;
    } else if (propValue != null) {
      node.attributes[propKey] = propValue;
    }
  },

  setStyles(node, styles) {
    for (let key in styles) {
      node.style[key] = styles[key];
    }
  }
};

export default Driver;
