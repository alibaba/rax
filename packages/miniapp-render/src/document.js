import EventTarget from './event/event-target';
import Tree from './tree/tree';
import Node from './node/node';
import Element from './node/element';
import TextNode from './node/text-node';
import Comment from './node/comment';
import tool from './util/tool';
import cache from './util/cache';
import A from './node/element/a';
import Image from './node/element/image';
import Input from './node/element/input';
import Textarea from './node/element/textarea';
import Video from './node/element/video';
import Canvas from './node/element/canvas';
import NotSupport from './node/element/not-support';
import BuiltInComponent from './node/element/builtin-component';
import CustomComponent from './node/element/custom-component';

const CONSTRUCTOR_MAP = {
  a: A,
  img: Image,
  input: Input,
  textarea: Textarea,
  video: Video,
  canvas: Canvas,
  'BUILTIN-COMPONENT': BuiltInComponent,
};
const BUILTIN_COMPONENT_MAP = {};
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
BUILTIN_COMPONENT_LIST.forEach(name => BUILTIN_COMPONENT_MAP[name] = name);
let CUSTOM_COMPONENT_MAP = {};

/**
 * 判断是否是内置组件
 */
function checkIsBuiltInComponent(tagName) {
  return BUILTIN_COMPONENT_MAP[tagName];
}

class Document extends EventTarget {
  constructor(pageId, nodeIdMap) {
    super();

    const config = cache.getConfig();
    const runtime = config.runtime || {};
    CUSTOM_COMPONENT_MAP = runtime.usingComponents || {};

    this.$_pageId = pageId;
    const pageRoute = tool.getPageRoute(pageId);
    const pageName = tool.getPageName(pageRoute);

    // 用于封装特殊标签和对应构造器
    const that = this;
    this.$_imageConstructor = function HTMLImageElement(width, height) {
      return Image.$$create({
        tagName: 'img',
        nodeId: `b-${tool.getId()}`, // 运行时生成，使用 b- 前缀
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
      nodeId: `a-${tool.getId()}`, // 运行前生成，使用 a- 前缀
      type: Node.DOCUMENT_NODE,
    });
    this.$_node.$$updateParent(this); // documentElement 的 parentNode 是 document
    this.$_node.scrollTop = 0;

    // head 元素
    this.$_head = this.createElement('head');

    // 更新 body 的 parentNode
    this.$_tree.root.$$updateParent(this.$_node);
  }

  /**
     * Image 构造器
     */
  get $$imageConstructor() {
    return this.$_imageConstructor;
  }

  get $$pageId() {
    return this.$_pageId;
  }

  /**
     * 触发节点事件
     */
  $$trigger(eventName, options) {
    this.documentElement.$$trigger(eventName, options);
  }

  /**
     * 内部所有节点创建都走此接口，统一把控
     */
  $$createElement(options, tree) {
    const originTagName = options.tagName;
    const tagName = originTagName.toUpperCase();
    let componentName = null;
    tree = tree || this.$_tree;

    const constructorClass = CONSTRUCTOR_MAP[tagName];
    if (constructorClass) {
      return constructorClass.$$create(options, tree);
      // eslint-disable-next-line no-cond-assign
    } else if (componentName = checkIsBuiltInComponent(originTagName)) {
      // 内置组件的特殊写法，转成 builtin-component 节点
      options.tagName = 'builtin-component';
      options.attrs = options.attrs || {};
      options.attrs.behavior = componentName;
      return BuiltInComponent.$$create(options, tree);
    } else if (CUSTOM_COMPONENT_MAP[originTagName]) {
      // 自定义组件的特殊写法，转成 custom-component 节点
      options.tagName = 'custom-component';
      options.attrs = options.attrs || {};
      options.componentName = originTagName;
      return CustomComponent.$$create(options, tree);
    } else if (!tool.isTagNameSupport(tagName)) {
      return NotSupport.$$create(options, tree);
    } else {
      return Element.$$create(options, tree);
    }
  }

  /**
     * 内部所有文本节点创建都走此接口，统一把控
     */
  $$createTextNode(options, tree) {
    return TextNode.$$create(options, tree || this.$_tree);
  }

  /**
     * 内部所有注释节点创建都走此接口，统一把控
     */
  $$createComment(options, tree) {
    return Comment.$$create(options, tree || this.$_tree);
  }

  /**
     * 对外属性和方法
     */
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

  get URL() {
    if (this.defaultView) return this.defaultView.location.href;

    return '';
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
      nodeId: `b-${tool.getId()}`, // 运行时生成，使用 b- 前缀
    });
  }

  createElementNS(ns, tagName) {
    // 不支持真正意义上的 createElementNS，转成调用 createElement
    return this.createElement(tagName);
  }

  createTextNode(content) {
    content = '' + content;

    return this.$$createTextNode({
      content,
      nodeId: `b-${tool.getId()}`, // 运行时生成，使用 b- 前缀
    });
  }

  createComment() {
    // 忽略注释内容的传入
    return this.$$createComment({
      nodeId: `b-${tool.getId()}`, // 运行时生成，使用 b- 前缀
    });
  }

  createDocumentFragment() {
    return Element.$$create({
      tagName: 'documentfragment',
      nodeId: `b-${tool.getId()}`, // 运行时生成，使用 b- 前缀
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
