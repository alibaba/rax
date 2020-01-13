import Node, { TextNode } from './Node';

const EMPTY_CONTENT = 'EMPTY';
const INSERT_ADJACENT_NODE = 'insertAdjacentNode';
const CREATE_ELEMENT = 'createElement';
const CREATE_TEXT_NODE = 'createTextNode';
const REMOVE_NODE = 'removeNode';
const SET_PROPERTY = 'setProperty';
const REMOVE_PROPERTY = 'removeProperty';
const ADD_EVENT = 'addEvent';
const REMOVE_EVENT = 'removeEvent';

export default class Driver {
  constructor() {
    const body = new Node('ROOT');
    body.id = -1; // nodeId -1 represents ROOT element.
    this.body = body;
  }

  // @driver protocol
  createBody() {
    return this.body;
  }

  // @driver protocol
  createElement(type, props, component) {
    const node = new Node(type, props);
    node.emit = this.emit.bind(this);
    this.emit(CREATE_ELEMENT, [node]);
    return node;
  }

  // @driver protocol
  createComment(content) {
    const node = new Node('COMMENT', { data: content });
    this.emit(CREATE_ELEMENT, [node]);
    return node;
  }

  // @driver protocol
  createEmpty(component) {
    return this.createComment(EMPTY_CONTENT);
  }

  // @driver protocol
  createText(text) {
    const node = new TextNode(text);
    this.emit(CREATE_TEXT_NODE, [node]);
    return node;
  }

  // @driver protocol
  updateText(node, text) {
    node.setProp('data', text);
    this.emit(SET_PROPERTY, [
      node.id,
      'data',
      text,
    ]);
  }

  // @driver protocol
  appendChild(node, parent) {
    if (parent) {
      node.parent = parent;
      parent.childNodes.push(node);

      this.emit(INSERT_ADJACENT_NODE, [
        parent.id,
        'beforeend',
        node.id,
      ]);
    }
  }

  // @driver protocol
  removeChild(node, parent) {
    if (parent) {
      node.parent = null;
      const childIndex = parent.childNodes.indexOf(node);
      parent.childNodes.splice(childIndex, 1);

      this.emit(REMOVE_NODE, [
        node.id,
      ]);
    }
    delete node.emit;
  }

  // @driver protocol
  replaceChild(newChild, oldChild, parent) {
    parent = parent || oldChild.parent;
    if (parent) {
      oldChild.parent = null;
      const childIndex = parent.childNodes.indexOf(oldChild);

      newChild.parent = parent;
      parent.childNodes.splice(childIndex, 1, newChild);

      this.emit(INSERT_ADJACENT_NODE, [
        oldChild.id,
        'afterend',
        newChild.id,
      ]);

      this.emit(REMOVE_NODE, [
        oldChild.id
      ]);
    }
  }

  // @driver protocol
  insertAfter(node, after, parent) {
    parent = parent || after.parent;
    if (parent) {
      const prevIndex = parent.childNodes.indexOf(after);
      parent.childNodes.splice(prevIndex + 1, 0, node);
      node.parent = parent;

      this.emit(INSERT_ADJACENT_NODE, [
        after.id,
        'afterend',
        node.id,
      ]);
    }
  }

  // @driver protocol
  insertBefore(node, before, parent) {
    parent = parent || before.parent;
    if (parent) {
      const nextIndex = parent.childNodes.indexOf(before);
      parent.childNodes.splice(nextIndex - 1, 0, node);
      node.parent = parent;

      this.emit(INSERT_ADJACENT_NODE, [
        before.id,
        'beforebegin',
        node.id,
      ]);
    }
  }

  // @driver protocol
  addEventListener(node, eventName, eventHandler, props) {
    if (!node.hasEvent(eventName)) {
      this.emit(ADD_EVENT, [
        node.id,
        eventName,
      ]);
    }
    node.addEventListener(eventName, eventHandler);
  }

  // @driver protocol
  removeEventListener(node, eventName, eventHandler, props) {
    node.removeEventListener(eventName, eventHandler);
    // Do not really emit remove event, due to performance consideration.
  }

  // @driver protocol
  removeAttribute(node, propKey) {
    node.setProp(propKey, undefined);
    this.emit(REMOVE_PROPERTY, [
      node.id,
      propKey
    ]);
  }

  // @driver protocol
  setAttribute(node, propKey, propValue) {
    propValue = node.setProp(propKey, propValue);
    this.emit(SET_PROPERTY, [
      node.id,
      propKey,
      propValue,
    ]);
  }

  // @driver protocol
  setStyle(node, styles) {
    this.setAttribute(node, 'style', Object.assign({}, node.style, styles));
  }

  /**
   * Impl actual message tunnel.
   * @param action <String> The action type.
   * @param payload <Object> Action payload.
   */
  emit(action, payload) {
    if (typeof this.postMessage !== 'function') {
      throw new Error('Can not get postMessage from driver');
    }
    this.postMessage([action, payload]);
  }

  // Reserved driver cycle.
  beforeRender() { }
  afterRender() { }
}

function getRootNode(node) {
  let root = node;
  while (root && root.parent) {
    root = root.parent;
  }
  return root;
}
