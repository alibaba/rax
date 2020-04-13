/* global CONTAINER */
import Node from './node';
import ClassList from './class-list';
import Style from './style';
import Attribute from './attribute';
import Pool from '../util/pool';
import cache from '../util/cache';
import tool from '../util/tool';
import parser from '../tree/parser';

const pool = new Pool();

class Element extends Node {
  static $$create(options, tree) {
    const config = cache.getConfig();

    if (config.optimization.elementMultiplexing) {
      // Reusing element node
      const instance = pool.get();

      if (instance) {
        instance.$$init(options, tree);
        return instance;
      }
    }

    return new Element(options, tree);
  }

  // Override the $$init method of the parent class
  $$init(options, tree) {
    options.type = 'element';

    super.$$init(options, tree);

    this.$_tagName = options.tagName || '';
    this.$_children = [];
    this.$_nodeType = options.nodeType || Node.ELEMENT_NODE;
    this.$_unary = !!parser.voidMap[this.$_tagName.toLowerCase()];
    this.$_notTriggerUpdate = false;
    this.$_dataset = null;
    this.$_classList = null;
    this.$_style = null;
    this.$_attrs = null;

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
    super.$$destroy();

    this.$_tagName = '';
    this.$_children.length = 0;
    this.$_nodeType = Node.ELEMENT_NODE;
    this.$_unary = null;
    this.$_notTriggerUpdate = false;
    this.$_dataset = null;
    this.$_classList = null;
    this.$_style = null;
    this.$_attrs = null;
  }

  // Recycling instance
  $$recycle() {
    this.$_children.forEach(child => child.$$recycle());
    this.$$destroy();

    const config = cache.getConfig();

    if (config.optimization.elementMultiplexing) {
      // Reusing element node
      pool.add(this);
    }
  }

  set $_dataset(value) {
    this.$__dataset = value;
  }

  get $_dataset() {
    if (!this.$__dataset) this.$__dataset = Object.create(null);
    return this.$__dataset;
  }

  set $_classList(value) {
    if (!value && this.$__classList) this.$__classList.$$recycle();
    this.$__classList = value;
  }

  get $_classList() {
    if (!this.$__classList) this.$__classList = ClassList.$$create(this.$_onClassOrStyleUpdate.bind(this));
    return this.$__classList;
  }

  set $_style(value) {
    if (!value && this.$__style) this.$__style.$$recycle();
    this.$__style = value;
  }

  get $_style() {
    if (!this.$__style) this.$__style = Style.$$create(this.$_onClassOrStyleUpdate.bind(this));
    return this.$__style;
  }

  set $_attrs(value) {
    if (!value && this.$__attrs) this.$__attrs.$$recycle();
    this.$__attrs = value;
  }

  get $_attrs() {
    if (!this.$__attrs) this.$__attrs = Attribute.$$create(this, this.$_triggerParentUpdate.bind(this));
    return this.$__attrs;
  }

  // Init attribute
  $_initAttrs(attrs = {}) {
    // Avoid create $_attrs when component init
    const attrKeys = Object.keys(attrs);
    if (!attrKeys.length) return;

    // Initialization does not trigger updates
    this.$_notTriggerUpdate = true;

    attrKeys.forEach(name => {
      if (name.indexOf('data-') === 0) {
        // dataset
        const datasetName = tool.toCamel(name.substr(5));
        this.$_dataset[datasetName] = attrs[name];
      } else {
        // Other attributes
        this.setAttribute(name, attrs[name]);
      }
    });

    // Restart triggers update
    this.$_notTriggerUpdate = false;
  }

  // Listen for class or style attribute values to change
  $_onClassOrStyleUpdate() {
    if (this.$__attrs) this.$_attrs.triggerUpdate();
    this.$_triggerParentUpdate();
  }

  // Update parent tree
  $_triggerParentUpdate() {
    if (this.parentNode && !this.$_notTriggerUpdate) this.parentNode.$$trigger('$$childNodesUpdate');
    if (!this.$_notTriggerUpdate) this.$$trigger('$$domNodeUpdate');
  }

  // Update child nodes
  $_triggerMeUpdate() {
    if (!this.$_notTriggerUpdate) this.$$trigger('$$childNodesUpdate');
  }

  // Changes to the mapping table caused by changes to update child nodes
  $_updateChildrenExtra(node, isRemove) {
    const id = node.id;

    // Update nodeId - dom map
    if (isRemove) {
      cache.setNode(this.$_pageId, node.$$nodeId, null);
    } else {
      cache.setNode(this.$_pageId, node.$$nodeId, node);
    }

    // Update id - dom map
    if (id) {
      if (isRemove) {
        this.$_tree.updateIdMap(id, null);
      } else {
        this.$_tree.updateIdMap(id, node);
      }
    }

    if (node.childNodes && node.childNodes.length) {
      for (const child of node.childNodes) {
        this.$_updateChildrenExtra(child, isRemove);
      }
    }
  }

  // Traverse the dom tree to generate the HTML
  $_generateHtml(node) {
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

      html = this.$$dealWithAttrsForGenerateHtml(html, node);

      if (node.$$isUnary) {
        // Empty tag
        return `${html} />`;
      } else {
        const childrenHtml = node.childNodes.map(child => this.$_generateHtml(child)).join('');
        return `${html}>${childrenHtml}</${tagName}>`;
      }
    }
  }

  // Traverse the ast to generate the dom tree
  $_generateDomTree(node) {
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

      const element = this.ownerDocument.$$createElement({
        tagName, attrs: attrsMap, nodeId
      });

      for (let child of children) {
        child = this.$_generateDomTree(child);

        if (child) element.appendChild(child);
      }

      return element;
    } else if (type === 'text') {
      // Text node
      return this.ownerDocument.$$createTextNode({
        content: tool.decodeContent(content), nodeId
      });
    }
  }

  // Dom info
  get $$domInfo() {
    return {
      nodeId: this.$$nodeId,
      pageId: this.$$pageId,
      type: this.$_type,
      tagName: this.$_tagName,
      id: this.id,
      class: this.className,
      style: this.$__style ? this.style.cssText : '',
      animation: this.$__attrs ? this.$__attrs.get('animation') : {}
    };
  }

  // Check Empty tag
  get $$isUnary() {
    return this.$_unary;
  }

  // The $_generateHtml interface is called to handle additional attributes
  $$dealWithAttrsForGenerateHtml(html) {
    // The concrete implementation logic is implemented by subclasses
    return html;
  }

  // The setter for outerHTML is called to handle the extra properties
  $$dealWithAttrsForOuterHTML() {
  }

  // The cloneNode interface is called to process additional properties
  $$dealWithAttrsForCloneNode() {
    return {};
  }

  $$getBoundingClientRect() {
    // Clears out setData
    tool.flushThrottleCache();
    const window = cache.getWindow(this.$_pageId);
    return new Promise((resolve, reject) => {
      if (!window) reject();

      if (this.tagName === 'BODY') {
        window.$$createSelectorQuery().selectViewport().scrollOffset(res => res ? resolve(res) : reject()).exec();
      } else {
        window.$$createSelectorQuery().select(`.miniprogram-root >>> .node-${this.$_nodeId}`).boundingClientRect(res => res ? resolve(res) : reject()).exec();
      }
    });
  }

  // Gets the context object of the corresponding widget component
  $$getContext() {
    // Clears out setData
    tool.flushThrottleCache();
    const window = cache.getWindow(this.$_pageId);
    return new Promise((resolve, reject) => {
      if (!window) reject();

      if (this.tagName === 'CANVAS') {
        // TODO, for the sake of compatibility with a bug in the underlying library, for the time being
        CONTAINER.createSelectorQuery().in(this._builtInComponent).select(`.node-${this.$_nodeId}`).context(res => res && res.context ? resolve(res.context) : reject())
          .exec();
      } else {
        window.$$createSelectorQuery().select(`.miniprogram-root >>> .node-${this.$_nodeId}`).context(res => res && res.context ? resolve(res.context) : reject()).exec();
      }
    });
  }

  // Gets the NodesRef object for the corresponding node
  $$getNodesRef() {
    // Clears out setData
    tool.flushThrottleCache();
    const window = cache.getWindow(this.$_pageId);
    return new Promise((resolve, reject) => {
      if (!window) reject();

      if (this.tagName === 'CANVAS') {
        // TODO, for the sake of compatibility with a bug in the underlying library, for the time being
        resolve(CONTAINER.createSelectorQuery().in(this._builtInComponent).select(`.node-${this.$_nodeId}`));
      } else {
        resolve(window.$$createSelectorQuery().select(`.miniprogram-root >>> .node-${this.$_nodeId}`));
      }
    });
  }

  // Sets properties, but does not trigger updates
  $$setAttributeWithoutUpdate(name, value) {
    this.$_notTriggerUpdate = true;
    this.setAttribute(name, value);
    this.$_notTriggerUpdate = false;
  }

  get id() {
    if (!this.$__attrs) return '';

    return this.$_attrs.get('id');
  }

  set id(id) {
    if (typeof id !== 'string') return;

    id = id.trim();
    const oldId = this.$_attrs.get('id');
    this.$_attrs.set('id', id);

    if (id === oldId) return;

    // update tree
    if (this.$_tree.getById(oldId) === this) this.$_tree.updateIdMap(oldId, null);
    if (id) this.$_tree.updateIdMap(id, this);
    this.$_triggerParentUpdate();
  }

  get tagName() {
    return this.$_tagName.toUpperCase();
  }

  get className() {
    if (!this.$__classList) return '';

    return this.$_classList.toString();
  }

  set className(className) {
    if (typeof className !== 'string') return;

    this.$_classList.$$parse(className);
  }

  get classList() {
    return this.$_classList;
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

  get innerHTML() {
    return this.$_children.map(child => this.$_generateHtml(child)).join('');
  }

  set innerHTML(html) {
    if (typeof html !== 'string') return;

    const fragment = this.ownerDocument.$$createElement({
      tagName: 'documentfragment',
      nodeId: `b-${tool.getId()}`,
      nodeType: Node.DOCUMENT_FRAGMENT_NODE,
    });

    // parse to ast
    let ast = null;
    try {
      ast = parser.parse(html);
    } catch (err) {
      console.error(err);
    }

    if (!ast) return;

    // Generate dom tree
    ast.forEach(item => {
      const node = this.$_generateDomTree(item);
      if (node) fragment.appendChild(node);
    });

    // Delete all child nodes
    this.$_children.forEach(node => {
      node.$$updateParent(null);

      // Update the mapping table
      this.$_updateChildrenExtra(node, true);
    });
    this.$_children.length = 0;

    // Appends the new child node
    if (this.$_tagName === 'table') {
      // The table node needs to determine whether a tbody exists
      let hasTbody = false;

      for (const child of fragment.childNodes) {
        if (child.tagName === 'TBODY') {
          hasTbody = true;
          break;
        }
      }

      if (!hasTbody) {
        const tbody = this.ownerDocument.$$createElement({
          tagName: 'tbody',
          attrs: {},
          nodeType: Node.ELEMENT_NODE,
          nodeId: `b-${tool.getId()}`,
        });

        tbody.appendChild(fragment);
        this.appendChild(tbody);
      }
    } else {
      this.appendChild(fragment);
    }
  }

  get outerHTML() {
    return this.$_generateHtml(this);
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
      const node = this.$_generateDomTree(ast);

      // Delete all child nodes
      this.$_children.forEach(node => {
        node.$$updateParent(null);

        // Update the mapping table
        this.$_updateChildrenExtra(node, true);
      });
      this.$_children.length = 0;

      // When first render doesn't trigger update
      this.$_notTriggerUpdate = true;

      // Append new child nodes
      const children = [].concat(node.childNodes);
      for (const child of children) {
        this.appendChild(child);
      }

      this.$_tagName = node.tagName.toLowerCase();
      this.id = node.id || '';
      this.className = node.className || '';
      this.style.cssText = node.style.cssText || '';
      this.src = node.src || '';
      this.$_dataset = Object.assign({}, node.dataset);

      this.$$dealWithAttrsForOuterHTML(node);

      // Trigger update
      this.$_notTriggerUpdate = false;
      this.$_triggerParentUpdate();
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
    return this.$_children.map(child => child.textContent).join('');
  }

  set textContent(text) {
    text = '' + text;

    // Delete all child nodes
    this.$_children.forEach(node => {
      node.$$updateParent(null);

      // Update mapping table
      this.$_updateChildrenExtra(node, true);
    });
    this.$_children.length = 0;

    // An empty string does not add a textNode node
    if (!text) return;

    // Generated at run time, using the b- prefix
    const nodeId = `b-${tool.getId()}`;
    const child = this.ownerDocument.$$createTextNode({content: text, nodeId});

    this.appendChild(child);
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
    return this.$_attrs.list;
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

    let nodes;
    let hasUpdate = false;

    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      // documentFragment
      nodes = [].concat(node.childNodes);
    } else {
      nodes = [node];
    }

    for (const node of nodes) {
      if (node === this) continue;
      if (node.parentNode) node.parentNode.removeChild(node);

      this.$_children.push(node);
      // Set parentNode
      node.$$updateParent(this);

      // Update map
      this.$_updateChildrenExtra(node);

      hasUpdate = true;
    }

    // Trigger webview update
    if (hasUpdate) this.$_triggerMeUpdate();

    return this;
  }

  removeChild(node) {
    if (!(node instanceof Node)) return;

    const index = this.$_children.indexOf(node);

    if (index >= 0) {
      // Inserted, need to delete
      this.$_children.splice(index, 1);

      node.$$updateParent(null);

      // Update map
      this.$_updateChildrenExtra(node, true);

      // Trigger webview update
      this.$_triggerMeUpdate();
    }

    return node;
  }

  insertBefore(node, ref) {
    if (!(node instanceof Node)) return;
    if (ref && !(ref instanceof Node)) return;

    let nodes;
    let hasUpdate = false;

    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      // documentFragment
      nodes = [];
      for (let i = 0; i < node.childNodes.length; i++) {
        // Need to invert them
        nodes.push(node.childNodes[i]);
      }
    } else {
      nodes = [node];
    }

    for (const node of nodes) {
      if (node === this) continue;
      if (node.parentNode) node.parentNode.removeChild(node);

      const insertIndex = ref ? this.$_children.indexOf(ref) : -1;

      if (insertIndex === -1) {
        // Insert to the end
        this.$_children.push(node);
      } else {
        // Inserted before ref
        this.$_children.splice(insertIndex, 0, node);
      }
      // Set parentNode
      node.$$updateParent(this);

      // Update the mapping table
      this.$_updateChildrenExtra(node);

      hasUpdate = true;
    }


    // Trigger the webview update
    if (hasUpdate) this.$_triggerMeUpdate();

    return node;
  }

  replaceChild(node, old) {
    if (!(node instanceof Node) || !(old instanceof Node)) return;

    let nodes;
    let hasUpdate = false;

    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      // documentFragment
      nodes = [];
      for (let i = node.childNodes.length - 1; i >= 0; i--) {
        // Inserted one by one, it need to reverse the order
        nodes.push(node.childNodes[i]);
      }
    } else {
      nodes = [node];
    }

    const replaceIndex = this.$_children.indexOf(old);
    if (replaceIndex !== -1) this.$_children.splice(replaceIndex, 1);

    for (const node of nodes) {
      if (node === this) continue;
      if (node.parentNode) node.parentNode.removeChild(node);

      if (replaceIndex === -1) {
        // Insert to the end
        this.$_children.push(node);
      } else {
        // Replace to old
        this.$_children.splice(replaceIndex, 0, node);
      }
      // Set parentNode
      node.$$updateParent(this);
      // Update the mapping table
      this.$_updateChildrenExtra(node);
      this.$_updateChildrenExtra(old, true);

      hasUpdate = true;
    }

    // Trigger the webview side update
    if (hasUpdate) this.$_triggerMeUpdate();

    return old;
  }

  hasChildNodes() {
    return this.$_children.length > 0;
  }

  getElementsByTagName(tagName) {
    if (typeof tagName !== 'string') return [];

    return this.$_tree.getByTagName(tagName, this);
  }

  getElementsByClassName(className) {
    if (typeof className !== 'string') return [];

    return this.$_tree.getByClassName(className, this);
  }

  querySelector(selector) {
    if (typeof selector !== 'string') return;

    return this.$_tree.query(selector, this)[0] || null;
  }

  querySelectorAll(selector) {
    if (typeof selector !== 'string') return [];

    return this.$_tree.query(selector, this);
  }

  setAttribute(name, value) {
    if (typeof name !== 'string') return;

    // preserve the original contents of the object/Array/boolean/undefined to facilitate the use of the built-in components of miniapp
    const valueType = typeof value;
    if (valueType !== 'object' && valueType !== 'boolean' && value !== undefined && !Array.isArray(value)) value = '' + value;

    if (name === 'id') {
      // id to be handled here in advance
      this.id = value;
    } else {
      this.$_attrs.set(name, value);
    }
  }

  getAttribute(name) {
    if (typeof name !== 'string') return '';
    if (!this.$__attrs) return name === 'id' || name === 'style' || name === 'class' ? '' : undefined;

    return this.$_attrs.get(name);
  }

  hasAttribute(name) {
    if (typeof name !== 'string') return false;
    if (!this.$__attrs) return false;

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

  getBoundingClientRect() {
    // Do not make any implementation, only for compatible use
    console.warn('getBoundingClientRect is not supported, please use npm package universal-element to get DOM info in miniapp');
    return {};
  }
}

export default Element;
