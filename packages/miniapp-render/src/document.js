import EventTarget from './event/event-target';
import Tree from './tree/tree';
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
  constructor(pageId, nodeIdMap) {
    super();

    const { usingComponents = {}, usingPlugins = {} } = cache.getConfig();
    this.usingComponents = usingComponents;
    this.usingPlugins = usingPlugins;
    this.__pageId = pageId;

    // Used to encapsulate special tag and corresponding constructors
    const that = this;
    this._imageConstructor = function HTMLImageElement(width, height) {
      return Image._create({
        tagName: 'img',
        nodeId: `b-${tool.getId()}`,
        attrs: {},
        width,
        height,
      }, that.__tree);
    };

    this.__tree = new Tree(pageId, {
      type: 'element',
      tagName: 'body',
      attrs: {},
      unary: false,
      nodeId: 'e-body',
      children: [],
    }, nodeIdMap, this);

    // documentElement
    this.__node = this._createElement({
      tagName: 'html',
      attrs: {},
      nodeId: `a-${tool.getId()}`,
      type: Node.DOCUMENT_NODE,
    });
    // documentElement's parentNode is document
    this.__node._updateParent(this);
    this.__node.scrollTop = 0;

    // head
    this.__head = this.createElement('head');

    // update body's parentNode
    this.__tree.root._updateParent(this.__node);
  }

  // Image constructor
  get imageConstructor() {
    return this._imageConstructor;
  }

  // Event trigger
  _trigger(eventName, options) {
    this.documentElement._trigger(eventName, options);
  }

  _createElement(options, tree) {
    const originTagName = options.tagName;
    const tagName = originTagName.toUpperCase();
    const componentName = checkIsBuiltInComponent(originTagName) ? originTagName : null;
    tree = tree || this.__tree;

    const constructorClass = CONSTRUCTOR_MAP[tagName];
    if (constructorClass) {
      return constructorClass._create(options, tree);
    } else if (componentName) {
      // Transform to builtin-component
      options.tagName = 'builtin-component';
      options.attrs = options.attrs || {};
      options.attrs._behavior = componentName;
      return BuiltInComponent._create(options, tree);
    } else if (this.usingComponents[originTagName]) {
      // Transform to custom-component
      options.tagName = 'custom-component';
      options.attrs = options.attrs || {};
      options.componentName = originTagName;
      return CustomComponent._create(options, tree);
    } else if (this.usingPlugins[originTagName]) {
      options.tagName = 'miniapp-plugin';
      options.attrs = options.attrs || {};
      options.componentName = originTagName;
      return CustomComponent._create(options, tree);
    } if (!tool.isTagNameSupport(tagName)) {
      throw new Error(`${tagName} is not supported.`);
    } else {
      return Element._create(options, tree);
    }
  }

  // Create text node
  _createTextNode(options, tree) {
    return TextNode._create(options, tree || this.__tree);
  }

  // Create comment node
  _createComment(options, tree) {
    return Comment._create(options, tree || this.__tree);
  }

  // Node type
  get nodeType() {
    return Node.DOCUMENT_NODE;
  }

  get documentElement() {
    return this.__node;
  }

  get body() {
    return this.__tree.root;
  }

  get nodeName() {
    return '#document';
  }

  get head() {
    return this.__head;
  }

  get defaultView() {
    return cache.getWindow() || null;
  }

  getElementById(id) {
    if (typeof id !== 'string') return;

    return this.__tree.getById(id) || null;
  }

  getElementsByTagName(tagName) {
    if (typeof tagName !== 'string') return [];

    return this.__tree.getByTagName(tagName);
  }

  getElementsByClassName(className) {
    if (typeof className !== 'string') return [];

    return this.__tree.getByClassName(className);
  }

  querySelector(selector) {
    if (typeof selector !== 'string') return;

    return this.__tree.query(selector)[0] || null;
  }

  querySelectorAll(selector) {
    if (typeof selector !== 'string') return [];

    return this.__tree.query(selector);
  }

  createElement(tagName) {
    if (typeof tagName !== 'string') return;

    tagName = tagName.trim();
    if (!tagName) return;

    return this._createElement({
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

    return this._createTextNode({
      content,
      nodeId: `b-${tool.getId()}`,
    });
  }

  createComment() {
    // Ignore the incoming comment content
    return this._createComment({
      nodeId: `b-${tool.getId()}`,
    });
  }

  createDocumentFragment() {
    return Element._create({
      tagName: 'documentfragment',
      nodeId: `b-${tool.getId()}`,
      nodeType: Node.DOCUMENT_FRAGMENT_NODE,
    }, this.__tree);
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
  const nodeIdMap = {};
  const document = new Document(pageId, nodeIdMap);

  cache.init(pageId, {
    document,
    nodeIdMap
  });

  return document;
};
