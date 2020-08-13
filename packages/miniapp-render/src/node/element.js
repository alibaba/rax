/* global CONTAINER */
import Node from './node';
import ClassList from './class-list';
import Style from './style';
import Attribute from './attribute';
import cache from '../utils/cache';
import tool from '../utils/tool';
import parser from '../tree/parser';

class Element extends Node {
  static _create(options, tree) {
    return new Element(options, tree);
  }

  // Override the _init method of the parent class
  _init(options, tree) {
    options.type = 'element';

    super._init(options, tree);

    this.__tagName = options.tagName || '';
    this.__children = [];
    this.__nodeType = options.nodeType || Node.ELEMENT_NODE;
    this.__unary = !!parser.voidMap[this.__tagName.toLowerCase()];
    this._dateset = null;
    this._classList = null;
    this._style = null;
    this._attrs = null;

    this._initAttrs(options.attrs);

    this.onclick = null;
    this.ontouchstart = null;
    this.ontouchmove = null;
    this.ontouchend = null;
    this.ontouchcancel = null;
    this.onload = null;
    this.onerror = null;
  }

  // Override the _destroy method of the parent class
  _destroy() {
    super._destroy();

    this.__tagName = '';
    this.__children = null;
    this.__nodeType = Node.ELEMENT_NODE;
    this.__unary = null;
    this._dateset = null;
    this._classList = null;
    this._style = null;
    this._attrs = null;
  }

  // Recycling instance
  _recycle() {
    this.__children.forEach(child => child._recycle());
    this._destroy();
  }

  set _dateset(value) {
    this.__dataset = value;
  }

  get _dateset() {
    if (!this.__dataset) this.__dataset = Object.create(null);
    return this.__dataset;
  }

  set _classList(value) {
    if (!value && this.__classList) this.__classList._recycle();
    this.__classList = value;
  }

  get _classList() {
    if (!this.__classList) this.__classList = ClassList._create(this, this._onClassOrStyleUpdate.bind(this));
    return this.__classList;
  }

  set _style(value) {
    if (!value && this.__style) this.__style._recycle();
    this.__style = value;
  }

  get _style() {
    if (!this.__style) this.__style = Style._create(this, this._onClassOrStyleUpdate.bind(this));
    return this.__style;
  }

  set _attrs(value) {
    if (!value && this.__attrs) this.__attrs._recycle();
    this.__attrs = value;
  }

  get _attrs() {
    if (!this.__attrs) this.__attrs = Attribute._create(this, this._triggerUpdate.bind(this));
    return this.__attrs;
  }

  // Init attribute
  _initAttrs(attrs = {}) {
    // Avoid create _attrs when component init
    const attrKeys = Object.keys(attrs);
    if (!attrKeys.length) return;

    attrKeys.forEach(name => {
      if (name.indexOf('data-') === 0) {
        // dataset
        const datasetName = tool.toCamel(name.substr(5));
        this._dateset[datasetName] = attrs[name];
      } else {
        // Other attributes
        this.__setAttributeWithoutUpdate(name, attrs[name]);
      }
    });
  }

  // Listen for class or style attribute values to change
  _onClassOrStyleUpdate(payload) {
    if (this.__attrs) this._attrs.triggerUpdate();
    this._triggerUpdate(payload);
  }

  _triggerUpdate(payload, immediate = true) {
    if (!this.__notTriggerUpdate) {
      this.enqueueRender(payload);
    } else if (!immediate && this._root) {
      this._root.renderStacks.push(payload);
    }
  }

  _traverseNodeMap(node, isRemove) {
    let queue = [];
    queue.push(node);
    while (queue.length) {
      let curNode = queue.shift();
      this._updateNodeMap(curNode, isRemove);
      if (curNode.childNodes && curNode.childNodes.length) {
        queue = queue.concat(curNode.childNodes);
      }
    }
  }
  // Changes to the mapping table caused by changes to update child nodes
  _updateNodeMap(node, isRemove) {
    const id = node.id;

    // Update nodeId - dom map
    if (isRemove) {
      cache.setNode(this.__pageId, node._nodeId, null);
    } else {
      cache.setNode(this.__pageId, node._nodeId, node);
    }

    // Update id - dom map
    if (id) {
      if (isRemove) {
        this.__tree.updateIdMap(id, null);
      } else {
        this.__tree.updateIdMap(id, node);
      }
    }
  }

  // Traverse the dom tree to generate the HTML
  _generateHtml(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      // Text node
      return node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Element
      const tagName = node.tagName.toLowerCase();
      let html = `<${tagName}`;

      // Attribute
      if (node.id) html += ` id="${node.id}"`;
      if (node.className) html += ` class="${node.className}"`;

      const styleText = node.style.cssText;
      if (styleText) html += ` style="${styleText}"`;

      const src = node.src;
      if (src) html += ` src=${src}`;

      const animation = node.animation;
      if (node.animation) html += `animation=${animation}`;

      const dataset = node.dataset;
      Object.keys(dataset).forEach(name => {
        html += ` data-${tool.toDash(name)}="${dataset[name]}"`;
      });

      html = this._dealWithAttrsForGenerateHtml(html, node);

      if (node._isUnary) {
        // Empty tag
        return `${html} />`;
      } else {
        const childrenHtml = node.childNodes.map(child => this._generateHtml(child)).join('');
        return `${html}>${childrenHtml}</${tagName}>`;
      }
    }
  }

  // Traverse the ast to generate the dom tree
  _generateDomTree(node) {
    const {
      type,
      tagName = '',
      attrs = [],
      children = [],
      content = '',
    } = node;

    // generated at runtime, using the b- prefix
    const nodeId = `b-${tool.getId()}`;

    if (type === 'element') {
      // Element
      const attrsMap = {};

      // The property list is converted to a map
      for (const attr of attrs) {
        const name = attr.name;
        let value = attr.value;

        if (name === 'style') value = value && value.replace('"', '\'') || '';

        attrsMap[name] = value;
      }

      const element = this.ownerDocument._createElement({
        tagName, attrs: attrsMap, nodeId
      });

      for (let child of children) {
        child = this._generateDomTree(child);

        if (child) element.appendChild(child);
      }

      return element;
    } else if (type === 'text') {
      // Text node
      return this.ownerDocument._createTextNode({
        content: tool.decodeContent(content), nodeId
      });
    }
  }

  // Dom info
  get _domInfo() {
    return {
      nodeId: this._nodeId,
      pageId: this.__pageId,
      nodeType: this.__type,
      tagName: this.__tagName,
      id: this.id,
      className: this.className,
      style: this.__style ? this.style.cssText : '',
      animation: this.__attrs ? this.__attrs.get('animation') : {},
      slot: this.__attrs ? this.__attrs.get('slot') : null,
    };
  }

  // Check Empty tag
  get _isUnary() {
    return this.__unary;
  }

  // The _generateHtml interface is called to handle additional attributes
  _dealWithAttrsForGenerateHtml(html) {
    // The concrete implementation logic is implemented by subclasses
    return html;
  }

  // The setter for outerHTML is called to handle the extra properties
  _dealWithAttrsForOuterHTML() {
  }

  // The cloneNode interface is called to process additional properties
  _dealWithAttrsForCloneNode() {
    return {};
  }

  // Sets properties, but does not trigger updates
  __setAttributeWithoutUpdate(name, value) {
    this.__notTriggerUpdate = true;
    this.setAttribute(name, value, false);
    this.__notTriggerUpdate = false;
  }

  get id() {
    if (!this.__attrs) return '';

    return this._attrs.get('id');
  }

  set id(id) {
    if (typeof id !== 'string') return;

    id = id.trim();
    const oldId = this._attrs.get('id');
    this._attrs.set('id', id);

    if (id === oldId) return;

    // update tree
    if (this.__tree.getById(oldId) === this) this.__tree.updateIdMap(oldId, null);
    if (id) this.__tree.updateIdMap(id, this);
    const payload = {
      path: `${this._path}.id`,
      value: id
    };
    this._triggerUpdate(payload);
  }

  get tagName() {
    return this.__tagName.toUpperCase();
  }

  get className() {
    if (!this.__classList) return '';

    return this._classList.toString();
  }

  set className(className) {
    if (typeof className !== 'string') return;

    this._classList._parse(className);
  }

  get classList() {
    return this._classList;
  }

  get nodeName() {
    return this.tagName;
  }

  get nodeType() {
    return this.__nodeType;
  }

  get childNodes() {
    return this.__children;
  }

  get children() {
    return this.__children.filter(child => child.nodeType === Node.ELEMENT_NODE);
  }

  get firstChild() {
    return this.__children[0];
  }

  get lastChild() {
    return this.__children[this.__children.length - 1];
  }

  get innerHTML() {
    return this.__children.map(child => this._generateHtml(child)).join('');
  }

  set innerHTML(html) {
    if (typeof html !== 'string') return;

    // parse to ast
    let ast = null;
    try {
      ast = parser.parse(html);
    } catch (err) {
      console.error(err);
    }

    if (!ast) return;

    // Generate dom tree
    const newChildNodes = [];
    ast.forEach(item => {
      const node = this._generateDomTree(item);
      if (node) newChildNodes.push(node);
    });

    // Delete all child nodes
    this.__children.forEach(node => {
      node._updateParent(null);

      // Update the mapping table
      this._traverseNodeMap(node, true);
    });
    this.__children.length = 0;

    // Append the new child nodes
    for (let i = 0, j = newChildNodes.length; i < j; i++) {
      this.appendChild(newChildNodes[i]);
    }
  }

  get outerHTML() {
    return this._generateHtml(this);
  }

  set outerHTML(html) {
    if (typeof html !== 'string') return;

    // Resolve to ast, taking only the first as the current node
    let ast = null;
    try {
      ast = parser.parse(html)[0];
    } catch (err) {
      console.error(err);
    }

    if (ast) {
      // Generate dom tree
      const node = this._generateDomTree(ast);

      // Delete all child nodes
      this.__children.forEach(node => {
        node._updateParent(null);

        // Update the mapping table
        this._traverseNodeMap(node, true);
      });
      this.__children.length = 0;

      // Append new child nodes
      const children = [].concat(node.childNodes);
      for (const child of children) {
        this.appendChild(child);
      }

      this.__tagName = node.tagName.toLowerCase();
      this.id = node.id || '';
      this.className = node.className || '';
      this.style.cssText = node.style.cssText || '';
      this.src = node.src || '';
      this._dateset = Object.assign({}, node.dataset);

      this._dealWithAttrsForOuterHTML(node);
    }
  }

  get innerText() {
    // WARN: this is handled in accordance with the textContent, not to determine whether it will be rendered or not
    return this.textContent;
  }

  set innerText(text) {
    this.textContent = text;
  }

  get textContent() {
    return this.__children.map(child => child.textContent).join('');
  }

  set textContent(text) {
    text = '' + text;

    // Delete all child nodes
    this.__children.forEach(node => {
      node._updateParent(null);

      // Update mapping table
      this._traverseNodeMap(node, true);
    });

    // An empty string does not add a textNode node
    if (!text) {
      const payload = {
        type: 'children',
        path: `${this._path}.children`,
        start: 0,
        deleteCount: this.__children.length
      };
      this.__children.length = 0;
      this._triggerUpdate(payload);
    } else {
      this.__children.length = 0;
      // Generated at run time, using the b- prefix
      const nodeId = `b-${tool.getId()}`;
      const child = this.ownerDocument._createTextNode({content: text, nodeId});

      this.appendChild(child);
    }
  }

  get style() {
    return this._style;
  }

  set style(value) {
    this._style.cssText = value;
  }

  get dataset() {
    return this._dateset;
  }

  get attributes() {
    return this._attrs.list;
  }

  get src() {
    if (!this.__attrs) return '';

    return this._attrs.get('src');
  }

  set src(value) {
    value = '' + value;
    this._attrs.set('src', value);
  }

  cloneNode(deep) {
    const dataset = {};
    Object.keys(this._dateset).forEach(name => {
      dataset[`data-${tool.toDash(name)}`] = this._dateset[name];
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
      nodeType: this.__nodeType,
      nodeId: `b-${tool.getId()}`,
    });

    if (deep) {
      // Deep clone
      for (const child of this.__children) {
        newNode.appendChild(child.cloneNode(deep));
      }
    }

    return newNode;
  }

  appendChild(node) {
    if (!(node instanceof Node)) return;

    if (node === this) return;
    if (node.parentNode) node.parentNode.removeChild(node);

    this.__children.push(node);
    // Set parentNode
    node._updateParent(this);

    // Update map
    this._traverseNodeMap(node);

    // Trigger update
    const payload = {
      type: 'children',
      path: `${this._path}.children`,
      start: this.__children.length - 1,
      deleteCount: 0,
      item: node
    };
    this._triggerUpdate(payload);

    return this;
  }

  removeChild(node) {
    if (!(node instanceof Node)) return;

    const index = this.__children.indexOf(node);

    if (index >= 0) {
      // Inserted, need to delete
      this.__children.splice(index, 1);

      node._updateParent(null);

      // Update map
      this._traverseNodeMap(node, true);

      // Trigger update
      const payload = {
        type: 'children',
        path: `${this._path}.children`,
        start: index,
        deleteCount: 1
      };
      this._triggerUpdate(payload);
    }

    return node;
  }

  insertBefore(node, ref) {
    if (!(node instanceof Node)) return;
    if (ref && !(ref instanceof Node)) return;

    if (node === this) return;
    if (node.parentNode) node.parentNode.removeChild(node);

    const insertIndex = ref ? this.__children.indexOf(ref) : -1;
    const payload = {
      type: 'children',
      path: `${this._path}.children`,
      deleteCount: 0,
      item: node
    };
    if (insertIndex === -1) {
      // Insert to the end
      this.__children.push(node);
      payload.start = this.__children.length - 1;
    } else {
      // Inserted before ref
      this.__children.splice(insertIndex, 0, node);
      payload.start = insertIndex;
    }
    // Set parentNode
    node._updateParent(this);

    // Update the mapping table
    this._traverseNodeMap(node);
    // Trigger update
    this._triggerUpdate(payload);

    return node;
  }

  replaceChild(node, old) {
    if (!(node instanceof Node) || !(old instanceof Node)) return;

    const replaceIndex = this.__children.indexOf(old);
    if (replaceIndex !== -1) this.__children.splice(replaceIndex, 1);

    if (node === this) return;
    if (node.parentNode) node.parentNode.removeChild(node);

    if (replaceIndex === -1) {
      // Insert to the end
      this.__children.push(node);
    } else {
      // Replace to old
      this.__children.splice(replaceIndex, 0, node);
    }
    // Set parentNode
    node._updateParent(this);
    // Update the mapping table
    this._traverseNodeMap(node);
    this._traverseNodeMap(old, true);

    // Trigger update
    const payload = {
      type: 'children',
      path: `${this._path}.children`,
      start: replaceIndex === -1 ? this.__children.length - 1 : replaceIndex,
      deleteCount: replaceIndex === -1 ? 0 : 1,
      item: node
    };
    this._triggerUpdate(payload);

    return old;
  }

  hasChildNodes() {
    return this.__children.length > 0;
  }

  getElementsByTagName(tagName) {
    if (typeof tagName !== 'string') return [];

    return this.__tree.getByTagName(tagName, this);
  }

  getElementsByClassName(className) {
    if (typeof className !== 'string') return [];

    return this.__tree.getByClassName(className, this);
  }

  querySelector(selector) {
    if (typeof selector !== 'string') return;

    return this.__tree.query(selector, this)[0] || null;
  }

  querySelectorAll(selector) {
    if (typeof selector !== 'string') return [];

    return this.__tree.query(selector, this);
  }

  setAttribute(name, value, immediate = true) {
    if (typeof name !== 'string') return;

    // preserve the original contents of the object/Array/boolean/undefined to facilitate the use of the built-in components of miniapp
    const valueType = typeof value;
    if (valueType !== 'object' && valueType !== 'boolean' && value !== undefined && !Array.isArray(value)) value = '' + value;

    if (name === 'id') {
      // id to be handled here in advance
      this.id = value;
    } else {
      this._attrs.set(name, value, immediate);
    }
  }

  getAttribute(name) {
    if (typeof name !== 'string') return '';
    if (!this.__attrs) return name === 'id' || name === 'style' || name === 'class' ? '' : undefined;

    return this._attrs.get(name);
  }

  hasAttribute(name) {
    if (typeof name !== 'string') return false;
    if (!this.__attrs) return false;

    return this._attrs.has(name);
  }

  removeAttribute(name) {
    if (typeof name !== 'string') return false;

    return this._attrs.remove(name);
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
