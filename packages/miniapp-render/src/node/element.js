/* global CONTAINER */
import Node from './node';
import ClassList from './class-list';
import Style from './style';
import Attribute from './attribute';
import cache from '../utils/cache';
import tool from '../utils/tool';
import { simplifyDomTree, traverse } from '../utils/tree';

class Element extends Node {
  constructor(options) {
    options.type = 'element';

    super(options);

    this.$_tagName = options.tagName || '';
    this.$_children = [];
    this.$_nodeType = options.nodeType || Node.ELEMENT_NODE;
    this.style = new Style(this);
    this.__attrs = new Attribute(this);
    cache.setNode(this.__pageId, this.$$nodeId, this);
    this.dataset = new Map();
    this.ownerDocument.__nodeIdMap.set(this.id || this.$$nodeId, this);

    this._initAttributes(options.attrs);

    this.onclick = null;
    this.ontouchstart = null;
    this.ontouchmove = null;
    this.ontouchend = null;
    this.ontouchcancel = null;
    this.onload = null;
    this.onerror = null;
  }

  // Override the $$destroy method of the parent class
  $$destroy() {
    this.$_children.forEach(child => child.$$destroy());
    cache.setNode(this.__pageId, this.$$nodeId, null);
    this.ownerDocument.__nodeIdMap.set(this.id || this.$$nodeId, null);
    super.$$destroy();
    this.$_tagName = '';
    this.$_children.length = 0;
    this.$_nodeType = Node.ELEMENT_NODE;
    this.$_unary = null;
    this.__attrs = null;
  }

  // Init attribute
  _initAttributes(attrs = {}) {
    Object.keys(attrs).forEach(name => {
      this._setAttributeWithOutUpdate(name, attrs[name]);
    });
  }

  _triggerUpdate(payload, immediate = true) {
    const root = this._root;
    if (!root) return;
    if (immediate) {
      this.enqueueRender(payload);
    } else {
      this._root.renderStacks.push(payload);
    }
  }

  get _renderInfo() {
    return {
      nodeId: this.$$nodeId,
      pageId: this.__pageId,
      nodeType: this.$_type,
      tagName: this.$_tagName,
      style: this.style.cssText
    };
  }

  // The cloneNode interface is called to process additional properties
  $$dealWithAttrsForCloneNode() {
    return {};
  }

  // Sets properties, but does not trigger updates
  _setAttributeWithOutUpdate(name, value) {
    this.__attrs._setWithOutUpdate(name, value);
  }

  get id() {
    return this.__attrs.get('id');
  }

  set id(id) {
    this.setAttribute('id', id);
  }

  get tagName() {
    return this.$_tagName.toUpperCase();
  }

  get className() {
    return this.getAttribute('class') || '';
  }

  set className(className) {
    this.setAttribute('class', className);
  }

  get classList() {
    return new ClassList(this.className, this);
  }

  get nodeName() {
    return this.tagName;
  }

  get nodeType() {
    return this.$_nodeType;
  }

  get childNodes() {
    return this.$_children;
  }

  get children() {
    return this.$_children.filter(child => child.nodeType === Node.ELEMENT_NODE);
  }

  get firstChild() {
    return this.$_children[0];
  }

  get lastChild() {
    return this.$_children[this.$_children.length - 1];
  }

  get innerText() {
    // WARN: this is handled in accordance with the textContent, not to determine whether it will be rendered or not
    return this.textContent;
  }

  set innerText(text) {
    this.textContent = text;
  }

  get textContent() {
    return this.$_children.map(child => child.textContent).join('');
  }

  set textContent(text) {
    text = '' + text;

    // An empty string does not add a textNode node
    if (!text) {
      const payload = {
        type: 'children',
        path: `${this._path}.children`,
        start: 0,
        deleteCount: this.$_children.length
      };
      this.$_children.length = 0;
      this._triggerUpdate(payload);
    } else {
      this.$_children.length = 0;
      // Generated at run time, using the b- prefix
      const nodeId = `b-${tool.getId()}`;
      const child = this.ownerDocument.$$createTextNode({content: text, nodeId, document: this.ownerDocument});

      this.appendChild(child);
    }
  }

  get attributes() {
    return this.__attrs;
  }

  get src() {
    if (!this.__attrs) return '';

    return this.__attrs.get('src');
  }

  set src(value) {
    value = '' + value;
    this.__attrs.set('src', value);
  }

  cloneNode(deep) {
    const dataset = new Map();
    this.dataset.forEach((value, name) => {
      dataset.set(`data-${tool.toDash(name)}`, value);
    });

    const newNode = this.ownerDocument.$$createElement({
      tagName: this.$_tagName,
      attrs: {
        id: this.id,
        class: this.className,
        style: this.style.cssText,
        src: this.src,

        ...dataset,
        ...this.$$dealWithAttrsForCloneNode(),
      },
      nodeType: this.$_nodeType,
      nodeId: `b-${tool.getId()}`,
    });

    if (deep) {
      // Deep clone
      for (const child of this.$_children) {
        newNode.appendChild(child.cloneNode(deep));
      }
    }

    return newNode;
  }

  appendChild(node) {
    if (!(node instanceof Node)) return;

    if (node === this) return;
    if (node.parentNode) node.parentNode.removeChild(node);

    this.$_children.push(node);
    // Set parentNode
    node.parentNode = this;

    if (this._isRendered()) {
      node.__rendered = true;
      // Trigger update
      const payload = {
        type: 'children',
        path: `${this._path}.children`,
        start: this.$_children.length - 1,
        deleteCount: 0,
        item: simplifyDomTree(node)
      };
      this._triggerUpdate(payload);
    }

    return this;
  }

  removeChild(node) {
    if (!(node instanceof Node)) return;

    const index = this.$_children.indexOf(node);

    if (index >= 0) {
      // Inserted, need to delete
      this.$_children.splice(index, 1);
      node.parentNode = null;
      node.__rendered = false;

      if (this._isRendered()) {
        node.__rendered = false;
        // Trigger update
        const payload = {
          type: 'children',
          path: `${this._path}.children`,
          start: index,
          deleteCount: 1
        };
        this._triggerUpdate(payload);
      }
    }

    return node;
  }

  insertBefore(node, ref) {
    if (!(node instanceof Node)) return;
    if (ref && !(ref instanceof Node)) return;

    if (node === this) return;
    if (node.parentNode) node.parentNode.removeChild(node);

    // Set parentNode
    node.parentNode = this;

    if (this._isRendered()) {
      node.__rendered = true;
      const insertIndex = ref ? this.$_children.indexOf(ref) : -1;
      const payload = {
        type: 'children',
        path: `${this._path}.children`,
        deleteCount: 0,
        item: simplifyDomTree(node)
      };
      if (insertIndex === -1) {
        // Insert to the end
        this.$_children.push(node);
        payload.start = this.$_children.length - 1;
      } else {
        // Inserted before ref
        this.$_children.splice(insertIndex, 0, node);
        payload.start = insertIndex;
      }
      // Trigger update
      this._triggerUpdate(payload);
    }

    return node;
  }

  replaceChild(node, old) {
    if (!(node instanceof Node) || !(old instanceof Node)) return;

    const replaceIndex = this.$_children.indexOf(old);
    if (replaceIndex !== -1) this.$_children.splice(replaceIndex, 1);

    if (node === this) return;
    if (node.parentNode) node.parentNode.removeChild(node);

    if (replaceIndex === -1) {
      // Insert to the end
      this.$_children.push(node);
    } else {
      // Replace to old
      this.$_children.splice(replaceIndex, 0, node);
    }
    // Set parentNode
    node.parentNode = this;

    if (this._isRendered()) {
      node.__rendered = true;
      // Trigger update
      const payload = {
        type: 'children',
        path: `${this._path}.children`,
        start: replaceIndex === -1 ? this.$_children.length - 1 : replaceIndex,
        deleteCount: replaceIndex === -1 ? 0 : 1,
        item: simplifyDomTree(node)
      };
      this._triggerUpdate(payload);
    }

    return old;
  }

  hasChildNodes() {
    return this.$_children.length > 0;
  }

  getElementsByTagName(tagName) {
    if (typeof tagName !== 'string') return [];
    const elements = [];
    traverse(this, element => {
      if (element && element.$_tagName === tagName) {
        elements.push(element);
      }
      return {};
    });
    return elements;
  }

  getElementsByClassName(className) {
    if (typeof className !== 'string') return [];
    const elements = [];
    traverse(this, element => {
      const classNames = className.trim().split(/\s+/);
      if (element && classNames.every(c => element.classList.has(c))) {
        elements.push(element);
      }
      return {};
    });
    return elements;
  }

  querySelector(selector) {
    if (selector[0] === '.') {
      const elements = this.getElementsByClassName(selector.slice(1));
      return elements.length > 0 ? elements[0] : null;
    } else if (selector[0] === '#') {
      return this.getElementById(selector.slice(1));
    } else if (/^[a-zA-Z]/.test(selector)) {
      const elements = this.getElementsByTagName(selector);
      return elements.length > 0 ? elements[0] : null;
    }
    return null;
  }

  querySelectorAll(selector) {
    if (typeof selector !== 'string') return [];

    if (selector[0] === '.') {
      return this.getElementsByClassName(selector.slice(1));
    } else if (selector[0] === '#') {
      const element = this.getElementById(selector.slice(1));
      return element ? [element] : [];
    } else if (/^[a-zA-Z]/.test(selector)) {
      return this.getElementsByTagName(selector);
    }
    return null;
  }

  setAttribute(name, value, immediate = true) {
    if (name === 'id') {
      this.ownerDocument.__nodeIdMap.delete(this.id || this.$$nodeId);
      this.ownerDocument.__nodeIdMap.set(this.id, this);
    }
    this.__attrs.set(name, value, immediate);
  }

  getAttribute(name) {
    return this.__attrs.get(name);
  }

  hasAttribute(name) {
    return this.__attrs.has(name);
  }

  removeAttribute(name) {
    return this.__attrs.remove(name);
  }

  contains(otherElement) {
    const stack = [];
    let checkElement = this;

    while (checkElement) {
      if (checkElement === otherElement) return true;

      const childNodes = checkElement.childNodes;
      if (childNodes && childNodes.length) childNodes.forEach(child => stack.push(child));

      checkElement = stack.pop();
    }

    return false;
  }

  enqueueRender(payload) {
    if (this._root === null) {
      return;
    }
    this._root.enqueueRender(payload);
  }

  getBoundingClientRect() {
    // Do not make any implementation, only for compatible use
    console.warn('getBoundingClientRect is not supported, please use npm package universal-element to get DOM info in miniapp');
    return {};
  }
}

export default Element;
