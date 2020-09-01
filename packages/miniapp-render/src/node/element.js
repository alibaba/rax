/* global CONTAINER */
import Node from './node';
import ClassList from './class-list';
import Style from './style';
import Attribute from './attribute';
import cache from '../utils/cache';
import tool from '../utils/tool';
import { simplifyDomTree, traverse }  from '../utils/tree';

class Element extends Node {
  constructor(options) {
    options.type = 'element';

    super(options);

    this.$_tagName = options.tagName || '';
    this.$_children = [];
    this.$_nodeType = options.nodeType || Node.ELEMENT_NODE;
    this.$_dataset = null;
    this.$_style = null;
    this.$_attrs = null;
    cache.setNode(this.__pageId, this.$$nodeId, this);
    this.ownerDocument.__nodeIdMap.set(this.id || this.$$nodeId, this);

    this.$_initAttrs(options.attrs);

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
    this.$_dataset = null;
    this.$_style = null;
    this.$_attrs = null;
  }

  set $_dataset(value) {
    this.$__dataset = value;
  }

  get $_dataset() {
    if (!this.$__dataset) this.$__dataset = Object.create(null);
    return this.$__dataset;
  }

  set $_style(value) {
    if (!value && this.$__style) this.$__style.$$destroy();
    this.$__style = value;
  }

  get $_style() {
    if (!this.$__style) this.$__style = new Style(this);
    return this.$__style;
  }

  set $_attrs(value) {
    if (!value && this.$__attrs) this.$__attrs.$$destroy();
    this.$__attrs = value;
  }

  get $_attrs() {
    if (!this.$__attrs) this.$__attrs = new Attribute(this, this._triggerUpdate.bind(this));
    return this.$__attrs;
  }

  // Init attribute
  $_initAttrs(attrs = {}) {
    // Avoid create $_attrs when component init
    const attrKeys = Object.keys(attrs);
    if (!attrKeys.length) return;

    attrKeys.forEach(name => {
      if (name.indexOf('data-') === 0) {
        // dataset
        const datasetName = tool.toCamel(name.substr(5));
        this.$_dataset[datasetName] = attrs[name];
      } else {
        // Other attributes
        this.__setAttributeWithoutUpdate(name, attrs[name]);
      }
    });
  }

  // Listen for class or style attribute values to change
  _onClassOrStyleUpdate(payload) {
    this._triggerUpdate(payload);
  }

  _triggerUpdate(payload, immediate = true) {
    if (!this.__notTriggerUpdate) {
      this.enqueueRender(payload);
    } else if (!immediate && this._root) {
      this._root.renderStacks.push(payload);
    }
  }

  // Dom info
  get $$domInfo() {
    return {
      nodeId: this.$$nodeId,
      pageId: this.__pageId,
      nodeType: this.$_type,
      tagName: this.$_tagName,
      id: this.id,
      className: this.className,
      style: this.style.cssText,
      animation: this.$__attrs ? this.$__attrs.get('animation') : {},
      slot: this.$__attrs ? this.$__attrs.get('slot') : null
    };
  }

  // The cloneNode interface is called to process additional properties
  $$dealWithAttrsForCloneNode() {
    return {};
  }

  // Sets properties, but does not trigger updates
  __setAttributeWithoutUpdate(name, value) {
    this.__notTriggerUpdate = true;
    this.setAttribute(name, value, false);
    this.__notTriggerUpdate = false;
  }

  get id() {
    if (!this.$__attrs) return '';

    return this.$_attrs.get('id');
  }

  set id(id) {
    if (typeof id !== 'string') return;

    id = id.trim();
    const oldId = this.$_attrs.get('id') || this.$$nodeId;
    this.$_attrs.set('id', id);

    if (id === oldId) return;

    if (id) {
      this.ownerDocument.__nodeIdMap.set(oldId, null);
      this.ownerDocument.__nodeIdMap.set(id, this);
    };
    const payload = {
      path: `${this._path}.id`,
      value: id
    };
    this._triggerUpdate(payload);
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

  get style() {
    return this.$_style;
  }

  set style(value) {
    this.$_style.cssText = value;
  }

  get dataset() {
    return this.$_dataset;
  }

  get attributes() {
    return this.$_attrs;
  }

  get src() {
    if (!this.$__attrs) return '';

    return this.$_attrs.get('src');
  }

  set src(value) {
    value = '' + value;
    this.$_attrs.set('src', value);
  }

  cloneNode(deep) {
    const dataset = {};
    Object.keys(this.$_dataset).forEach(name => {
      dataset[`data-${tool.toDash(name)}`] = this.$_dataset[name];
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

      if (this._isRendered()) {
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
    if (typeof name !== 'string') return;

    // preserve the original contents of the object/Array/boolean/undefined to facilitate the use of the built-in components of miniapp
    const valueType = typeof value;
    if (valueType !== 'object' && valueType !== 'boolean' && value !== undefined && !Array.isArray(value)) value = '' + value;

    if (name === 'id') {
      // id to be handled here in advance
      this.ownerDocument.__nodeIdMap.delete(this.id || this.$$nodeId)
      this.id = value;
      this.ownerDocument.__nodeIdMap.set(this.id, this);
    } else {
      this.$_attrs.set(name, value, immediate);
    }
  }

  getAttribute(name) {
    if (typeof name !== 'string') return '';

    return this.$_attrs.get(name);
  }

  hasAttribute(name) {
    if (typeof name !== 'string') return false;

    return this.$_attrs.has(name);
  }

  removeAttribute(name) {
    if (typeof name !== 'string') return false;

    return this.$_attrs.remove(name);
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
