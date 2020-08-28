import EventTarget from './event/event-target';
import Node from './node/node';
import Element from './node/element';
import TextNode from './node/text-node';
import Comment from './node/comment';
import tool from './utils/tool';
import cache from './utils/cache';
import Image from './node/element/image';
import Input from './node/element/input';
import Textarea from './node/element/textarea';
import Video from './node/element/video';
import BuiltInComponent from './node/element/builtin-component';
import CustomComponent from './node/element/custom-component';
import RootElement from './node/root';

const CONSTRUCTOR_MAP = {
  IMG: Image,
  INPUT: Input,
  TEXTAREA: Textarea,
  VIDEO: Video,
  'BUILTIN-COMPONENT': BuiltInComponent,
};
const BUILTIN_COMPONENT_LIST = [
  'movable-view', 'cover-image', 'cover-view', 'movable-area', 'scroll-view', 'swiper', 'swiper-item', 'view',
  'icon', 'progress', 'rich-text', 'text',
  'button', 'checkbox', 'checkbox-group', 'editor', 'form', 'input', 'label', 'picker', 'picker-view', 'picker-view-column', 'radio', 'radio-group', 'slider', 'switch', 'textarea',
  'functional-page-navigator', 'navigator',
  'audio', 'camera', 'image', 'live-player', 'live-pusher', 'video',
  'map',
  'canvas',
  'ad', 'official-account', 'open-data', 'web-view'
];

/**
 * Check this component is builtIn component
 * @param {string} tagName - component tag name
 * @return {boolean}
 */
function checkIsBuiltInComponent(tagName) {
  return BUILTIN_COMPONENT_LIST.indexOf(tagName) > -1;
}

class Document extends EventTarget {
  constructor(pageId) {
    super();

    const { usingComponents = {}, usingPlugins = {} } = cache.getConfig();
    this.usingComponents = usingComponents;
    this.usingPlugins = usingPlugins;

    this.__nodeIdMap = {};
    this.__idMap = {};
    this.__classMap = {};
    this.__tagMap = {};
    this.__pageId = pageId;
    this.$_config = null;

    // documentElement
    this.$_node = this.$$createElement({
      document: this,
      tagName: 'html',
      attrs: {},
      nodeId: `a-${tool.getId()}`,
      type: Node.DOCUMENT_NODE,
    });
    // documentElement's parentNode is document
    this.$_node.$$updateParent(this);
    this.$_node.scrollTop = 0;

    this.__root = new RootElement({
      type: 'element',
      tagName: 'body',
      attrs: {},
      unary: false,
      nodeId: 'e-body',
      children: [],
      document: this,
    });

    // update body's parentNode
    this.__root.$$updateParent(this.$_node);
  }

  // Event trigger
  $$trigger(eventName, options) {
    this.documentElement.$$trigger(eventName, options);
  }

  _isRendered() {
    return true;
  }

  $$createElement(options) {
    const originTagName = options.tagName;
    const tagName = originTagName.toUpperCase();
    const componentName = checkIsBuiltInComponent(originTagName) ? originTagName : null;

    const constructorClass = CONSTRUCTOR_MAP[tagName];
    if (constructorClass) {
      return constructorClass.$$create(options);
    } else if (componentName) {
      // Transform to builtin-component
      options.tagName = 'builtin-component';
      options.attrs = options.attrs || {};
      options.attrs._behavior = componentName;
      return BuiltInComponent.$$create(options);
    } else if (this.usingComponents[originTagName]) {
      // Transform to custom-component
      options.tagName = 'custom-component';
      options.attrs = options.attrs || {};
      options.componentName = originTagName;
      return CustomComponent.$$create(options);
    } else if (this.usingPlugins[originTagName]) {
      options.tagName = 'miniapp-plugin';
      options.attrs = options.attrs || {};
      options.componentName = originTagName;
      return CustomComponent.$$create(options);
    } else if (!tool.isTagNameSupport(tagName)) {
      throw new Error(`${tagName} is not supported.`);
    } else {
      return Element.$$create(options);
    }
  }

  // Create text node
  $$createTextNode(options) {
    return TextNode.$$create(options);
  }

  // Create comment node
  $$createComment(options) {
    return Comment.$$create(options);
  }

  // Node type
  get nodeType() {
    return Node.DOCUMENT_NODE;
  }

  get documentElement() {
    return this.$_node;
  }

  get body() {
    return this.__root;
  }

  get nodeName() {
    return '#document';
  }

  get defaultView() {
    return cache.getWindow() || null;
  }

  getElementById(id) {
    if (typeof id !== 'string') return;

    return this.__idMap[id] || null;
  }

  getElementsByTagName(tagName) {
    if (typeof tagName !== 'string') return [];

    return this.__tagMap[tagName] || [];
  }

  getElementsByClassName(className) {
    if (typeof className !== 'string') return [];

    return this.__classMap[className] || [];
  }

  querySelector(selector) {
    if (typeof selector !== 'string') return;
    // Todo
    return null;
  }

  querySelectorAll(selector) {
    if (typeof selector !== 'string') return [];
    // Todo
    return null;
  }

  createElement(tagName) {
    if (typeof tagName !== 'string') return;

    tagName = tagName.trim();
    if (!tagName) return;

    return this.$$createElement({
      document: this,
      tagName,
      nodeId: `b-${tool.getId()}`,
    });
  }

  createElementNS(ns, tagName) {
    // Actually use createElement
    return this.createElement(tagName);
  }

  createTextNode(content) {
    content = '' + content;

    return this.$$createTextNode({
      content,
      nodeId: `b-${tool.getId()}`,
      document: this
    });
  }

  createComment() {
    // Ignore the incoming comment content
    return this.$$createComment({
      nodeId: `b-${tool.getId()}`,
      document: this
    });
  }

  createDocumentFragment() {
    return Element.$$create({
      tagName: 'documentfragment',
      nodeId: `b-${tool.getId()}`,
      nodeType: Node.DOCUMENT_FRAGMENT_NODE,
    });
  }

  createEvent() {
    const window = cache.getWindow();

    return new window.CustomEvent();
  }

  addEventListener(eventName, handler, options) {
    this.documentElement.addEventListener(eventName, handler, options);
  }

  removeEventListener(eventName, handler, isCapture) {
    this.documentElement.removeEventListener(eventName, handler, isCapture);
  }

  dispatchEvent(evt) {
    this.documentElement.dispatchEvent(evt);
  }
}

export default function createDocument(pageId) {
  const document = new Document(pageId);

  cache.init(pageId, {
    document
  });

  return document;
};
