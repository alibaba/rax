import EventTarget from './event/event-target';
import Tree from './tree/tree';
import Node from './node/node';
import Element from './node/element';
import TextNode from './node/text-node';
import Comment from './node/comment';
import tool from './util/tool';
import cache from './util/cache';
import Image from './node/element/image';
import Input from './node/element/input';
import Textarea from './node/element/textarea';
import Video from './node/element/video';
import Canvas from './node/element/canvas';
import BuiltInComponent from './node/element/builtin-component';
import CustomComponent from './node/element/custom-component';

const CONSTRUCTOR_MAP = {
  IMG: Image,
  INPUT: Input,
  TEXTAREA: Textarea,
  VIDEO: Video,
  CANVAS: Canvas,
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

    const config = cache.getConfig();
    const nativeCustomComponent = config.nativeCustomComponent || {};
    this.usingComponents = nativeCustomComponent.usingComponents || {};

    this.$_pageId = pageId;

    // Used to encapsulate special tag and corresponding constructors
    const that = this;
    this.$_imageConstructor = function HTMLImageElement(width, height) {
      return Image.$$create({
        tagName: 'img',
        nodeId: `b-${tool.getId()}`,
        attrs: {},
        width,
        height,
      }, that.$_tree);
    };

    this.$_pageId = pageId;
    this.$_tree = new Tree(pageId, {
      type: 'element',
      tagName: 'body',
      attrs: {},
      unary: false,
      nodeId: 'e-body',
      children: [],
    }, nodeIdMap, this);
    this.$_config = null;

    // documentElement
    this.$_node = this.$$createElement({
      tagName: 'html',
      attrs: {},
      nodeId: `a-${tool.getId()}`,
      type: Node.DOCUMENT_NODE,
    });
    // documentElement's parentNode is document
    this.$_node.$$updateParent(this);
    this.$_node.scrollTop = 0;

    // head
    this.$_head = this.createElement('head');

    // update body's parentNode
    this.$_tree.root.$$updateParent(this.$_node);
  }

  // Image constructor
  get $$imageConstructor() {
    return this.$_imageConstructor;
  }

  get $$pageId() {
    return this.$_pageId;
  }

  // Event trigger
  $$trigger(eventName, options) {
    this.documentElement.$$trigger(eventName, options);
  }

  $$createElement(options, tree) {
    const originTagName = options.tagName;
    const tagName = originTagName.toUpperCase();
    const componentName = checkIsBuiltInComponent(originTagName) ? originTagName : null;
    tree = tree || this.$_tree;

    const constructorClass = CONSTRUCTOR_MAP[tagName];
    if (constructorClass) {
      return constructorClass.$$create(options, tree);
    } else if (componentName) {
      // Transform to builtin-component
      options.tagName = 'builtin-component';
      options.attrs = options.attrs || {};
      options.attrs.behavior = componentName;
      return BuiltInComponent.$$create(options, tree);
    } else if (this.usingComponents[originTagName]) {
      // Transform to custom-component
      options.tagName = 'custom-component';
      options.attrs = options.attrs || {};
      options.componentName = originTagName;
      return CustomComponent.$$create(options, tree);
    } else if (!tool.isTagNameSupport(tagName)) {
      throw new Error(`${tagName} is not supported.`);
    } else {
      return Element.$$create(options, tree);
    }
  }

  // Create text node
  $$createTextNode(options, tree) {
    return TextNode.$$create(options, tree || this.$_tree);
  }

  // Create comment node
  $$createComment(options, tree) {
    return Comment.$$create(options, tree || this.$_tree);
  }

  // Node type
  get nodeType() {
    return Node.DOCUMENT_NODE;
  }

  get documentElement() {
    return this.$_node;
  }

  get body() {
    return this.$_tree.root;
  }

  get nodeName() {
    return '#document';
  }

  get head() {
    return this.$_head;
  }

  get defaultView() {
    return cache.getWindow(this.$_pageId) || null;
  }

  getElementById(id) {
    if (typeof id !== 'string') return;

    return this.$_tree.getById(id) || null;
  }

  getElementsByTagName(tagName) {
    if (typeof tagName !== 'string') return [];

    return this.$_tree.getByTagName(tagName);
  }

  getElementsByClassName(className) {
    if (typeof className !== 'string') return [];

    return this.$_tree.getByClassName(className);
  }

  querySelector(selector) {
    if (typeof selector !== 'string') return;

    return this.$_tree.query(selector)[0] || null;
  }

  querySelectorAll(selector) {
    if (typeof selector !== 'string') return [];

    return this.$_tree.query(selector);
  }

  createElement(tagName) {
    if (typeof tagName !== 'string') return;

    tagName = tagName.trim();
    if (!tagName) return;

    return this.$$createElement({
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
    });
  }

  createComment() {
    // Ignore the incoming comment content
    return this.$$createComment({
      nodeId: `b-${tool.getId()}`,
    });
  }

  createDocumentFragment() {
    return Element.$$create({
      tagName: 'documentfragment',
      nodeId: `b-${tool.getId()}`,
      nodeType: Node.DOCUMENT_FRAGMENT_NODE,
    }, this.$_tree);
  }

  createEvent() {
    const window = cache.getWindow(this.$_pageId);

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

export default Document;
