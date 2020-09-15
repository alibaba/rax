/* global CONTAINER */
import Node from './node';
import ClassList from './class-list';
import Style from './style';
import Attribute from './attribute';
import cache from '../utils/cache';
import tool from '../utils/tool';
import { simplifyDomTree, traverse } from '../utils/tree';
import { BUILTIN_COMPONENT_LIST } from '../constants';

class Element extends Node {
  constructor(options) {
    options.type = 'element';

    super(options);

    this.__tagName = options.tagName || '';
    this.__isBuiltinComponent = BUILTIN_COMPONENT_LIST.has(this.__tagName);
    this.__tmplName = this.__isBuiltinComponent ? this.__tagName : 'h-element';
    this.childNodes = [];
    this.__nodeType = options.nodeType || Node.ELEMENT_NODE;
    this.style = new Style(this);
    this.__attrs = new Attribute(this);
    cache.setNode(this.__pageId, this.__nodeId, this);
    this.dataset = {};
    this.ownerDocument.__nodeIdMap.set(this.__nodeId, this);
    if (this.id) {
      this.ownerDocument.__idMap.set(this.id, this);
    }

    this._initAttributes(options.attrs);
  }

  // Override the $$destroy method of the parent class
  $$destroy() {
    this.childNodes.forEach(child => child.$$destroy());
    cache.setNode(this.__pageId, this.__nodeId, null);
    this.ownerDocument.__nodeIdMap.set(this.__nodeId, null);
    this.ownerDocument.__idMap.set(this.id, null);
    super.$$destroy();
    this.__tagName = '';
    this.childNodes.length = 0;
    this.__nodeType = Node.ELEMENT_NODE;
    this.__attrs = null;
  }

  // Init attribute
  _initAttributes(attrs = {}) {
    Object.keys(attrs).forEach(name => {
      this._setAttributeWithOutUpdate(name, attrs[name]);
    });
  }

  _triggerUpdate(payload, immediate = true) {
    if (immediate) {
      this.enqueueRender(payload);
    } else {
      this._root.renderStacks.push(payload);
    }
  }

  get _renderInfo() {
    return {
      nodeId: this.__nodeId,
      pageId: this.__pageId,
      nodeType: this.__tmplName,
      ...this.__attrs.__value,
      style: this.style.cssText,
      class: this.__isBuiltinComponent ? this.className : `h5-${this.__tagName} ${this.className}`,
    };
  }

  // The cloneNode interface is called to process additional properties
  _dealWithAttrsForCloneNode() {
    return {};
  }

  // Sets properties, but does not trigger updates
  _setAttributeWithOutUpdate(name, value) {
    this.__attrs._setWithOutUpdate(name, value);
  }

  get id() {
    return this.__attrs.get('id') || '';
  }

  set id(id) {
    this.setAttribute('id', id);
  }

  get tagName() {
    return this.__tagName.toUpperCase();
  }

  get className() {
    return this.getAttribute('class') || '';
  }

  set className(className) {
    this.setAttribute('class', className);
  }

  get classList() {
    return ClassList._create(this.className, this);
  }

  get nodeName() {
    return this.tagName;
  }

  get nodeType() {
    return this.__nodeType;
  }

  get children() {
    return this.childNodes.filter(child => child.nodeType === Node.ELEMENT_NODE);
  }

  get firstChild() {
    return this.childNodes[0];
  }

  get lastChild() {
    return this.childNodes[this.childNodes.length - 1];
  }

  get innerText() {
    // WARN: this is handled in accordance with the textContent, not to determine whether it will be rendered or not
    return this.textContent;
  }

  set innerText(text) {
    this.textContent = text;
  }

  get textContent() {
    return this.childNodes.map(child => child.textContent).join('');
  }

  set textContent(text) {
    text = '' + text;

    // An empty string does not add a textNode node
    if (!text) {
      const payload = {
        type: 'children',
        path: `${this._path}.children`,
        start: 0,
        deleteCount: this.childNodes.length
      };
      this.childNodes.length = 0;
      this._triggerUpdate(payload);
    } else {
      this.childNodes.length = 0;
      const child = this.ownerDocument.createTextNode(text);

      this.appendChild(child);
    }
  }

  get attributes() {
    return this.__attrs;
  }

  get src() {
    if (!this.__attrs) return '';

    return this.__attrs.get('src') || undefined;
  }

  set src(value) {
    value = '' + value;
    this.__attrs.set('src', value);
  }

  cloneNode(deep) {
    const dataset = {};
    Object.keys(this.dataset).forEach(name => {
      dataset[`data-${tool.toDash(name)}`] = this.dataset[name];
    });
    const newNode = this.ownerDocument._createElement({
      tagName: this.__tagName,
      attrs: {
        id: this.id,
        class: this.className,
        style: this.style.cssText,
        src: this.src,

        ...dataset,
        ...this._dealWithAttrsForCloneNode(),
      },
      document: this.ownerDocument,
      nodeType: this.__nodeType
    });

    if (deep) {
      // Deep clone
      for (const child of this.childNodes) {
        newNode.appendChild(child.cloneNode(deep));
      }
    }

    return newNode;
  }

  appendChild(node) {
    if (node === this) return;
    if (node.parentNode) node.parentNode.removeChild(node);

    this.childNodes.push(node);
    // Set parentNode
    node.parentNode = this;

    if (this._isRendered()) {
      node.__rendered = true;
      // Trigger update
      const payload = {
        type: 'children',
        path: `${this._path}.children`,
        start: this.childNodes.length - 1,
        deleteCount: 0,
        item: simplifyDomTree(node)
      };
      this._triggerUpdate(payload);
    }

    return this;
  }

  removeChild(node) {
    if (!(node instanceof Node)) return;

    const index = this.childNodes.indexOf(node);

    if (index >= 0) {
      // Inserted, need to delete
      this.childNodes.splice(index, 1);
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
    const insertIndex = ref ? this.childNodes.indexOf(ref) : -1;
    if (insertIndex === -1) {
      // Insert to the end
      this.childNodes.push(node);
    } else {
      // Inserted before ref
      this.childNodes.splice(insertIndex, 0, node);
    }
    if (this._isRendered()) {
      node.__rendered = true;
      const payload = {
        type: 'children',
        path: `${this._path}.children`,
        deleteCount: 0,
        item: simplifyDomTree(node),
        start: insertIndex === -1 ? this.childNodes.length - 1 : insertIndex
      };

      // Trigger update
      this._triggerUpdate(payload);
    }

    return node;
  }

  replaceChild(node, old) {
    if (!(node instanceof Node) || !(old instanceof Node)) return;

    const replaceIndex = this.childNodes.indexOf(old);
    if (replaceIndex !== -1) this.childNodes.splice(replaceIndex, 1);

    if (node === this) return;
    if (node.parentNode) node.parentNode.removeChild(node);

    if (replaceIndex === -1) {
      // Insert to the end
      this.childNodes.push(node);
    } else {
      // Replace to old
      this.childNodes.splice(replaceIndex, 0, node);
    }
    // Set parentNode
    node.parentNode = this;

    if (this._isRendered()) {
      node.__rendered = true;
      // Trigger update
      const payload = {
        type: 'children',
        path: `${this._path}.children`,
        start: replaceIndex === -1 ? this.childNodes.length - 1 : replaceIndex,
        deleteCount: replaceIndex === -1 ? 0 : 1,
        item: simplifyDomTree(node)
      };
      this._triggerUpdate(payload);
    }

    return old;
  }

  hasChildNodes() {
    return this.childNodes.length > 0;
  }

  getElementsByTagName(tagName) {
    if (typeof tagName !== 'string') return [];
    const elements = [];
    traverse(this, element => {
      if (element !== this && element && element.__tagName === tagName) {
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
      if (element !== this && element && classNames.every(c => element.classList && element.classList.contains(c))) {
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
      return this.ownerDocument.getElementById(selector.slice(1));
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
      const element = this.ownerDocument.getElementById(selector.slice(1));
      return element ? [element] : [];
    } else if (/^[a-zA-Z]/.test(selector)) {
      return this.getElementsByTagName(selector);
    }
    return null;
  }

  setAttribute(name, value, immediate = true) {
    if (name === 'id' && value !== this.id) {
      this.ownerDocument.__idMap.delete(this.id);
      this.ownerDocument.__idMap.set(value, this);
    }
    this.__attrs.set(name, value, immediate);
  }

  getAttribute(name) {
    return this.__attrs.get(name);
  }

  hasAttribute(name) {
    if (name === 'style' || name === 'id') {
      return !!this.getAttribute(name);
    }
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
    this._root.enqueueRender(payload);
  }

  getBoundingClientRect() {
    // Do not make any implementation, only for compatible use
    console.warn('getBoundingClientRect is not supported, please use npm package universal-element to get DOM info in miniapp');
    return {};
  }
}

export default Element;
