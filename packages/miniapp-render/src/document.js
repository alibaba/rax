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

const CONSTRUCTOR_MAP = new Map([['img', Image], ['input', Input], ['textarea', Textarea], ['video', Video]]);

const BUILTIN_COMPONENT_LIST = new Set([
  'movable-view', 'cover-image', 'cover-view', 'movable-area', 'scroll-view', 'swiper', 'swiper-item', 'view',
  'icon', 'progress', 'rich-text', 'text',
  'button', 'checkbox', 'checkbox-group', 'editor', 'form', 'input', 'label', 'picker', 'picker-view', 'picker-view-column', 'radio', 'radio-group', 'slider', 'switch', 'textarea',
  'functional-page-navigator', 'navigator',
  'audio', 'camera', 'image', 'live-player', 'live-pusher', 'video',
  'map',
  'canvas',
  'ad', 'official-account', 'open-data', 'web-view'
]);

class Document extends EventTarget {
  constructor(pageId) {
    super();

    const { usingComponents = {}, usingPlugins = {} } = cache.getConfig();
    this.usingComponents = usingComponents;
    this.usingPlugins = usingPlugins;

    this.__nodeIdMap = new Map();
    this.__idMap = new Map();
    this.__pageId = pageId;

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
    this.__root.parentNode = this;
  }

  // Event trigger
  $$trigger(eventName, options) {
    this.documentElement.$$trigger(eventName, options);
  }

  _isRendered() {
    return true;
  }

  $$createElement(options) {
    const ConstructorClass = CONSTRUCTOR_MAP.get(options.tagName);
    if (ConstructorClass) {
      return new ConstructorClass(options);
    }

    options.attrs = options.attrs || {};

    if (BUILTIN_COMPONENT_LIST.has(options.tagName)) {
      // Transform to builtin-component
      return new BuiltInComponent(options);
    } else if (this.usingComponents[options.tagName]) {
      // Transform to custom-component
      options.tagName = 'custom-component';
      return new CustomComponent(options);
    } else if (this.usingPlugins[options.tagName]) {
      options.tagName = 'miniapp-plugin';
      return new CustomComponent(options);
    } else {
      return new Element(options);
    }
  }

  // Node type
  get nodeType() {
    return Node.DOCUMENT_NODE;
  }

  get documentElement() {
    return this;
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

    const element = this.__idMap.get(id);
    if (element && element._isRendered()) {
      return element;
    }
    return null;
  }

  getElementsByTagName(tagName) {
    if (typeof tagName !== 'string') return [];

    const elements = [];
    this.__nodeIdMap.forEach((element, nodeId) => {
      if (element && element.$_tagName === tagName && element._isRendered()) {
        elements.push(element);
      }
    });
    return elements;
  }

  getElementsByClassName(className) {
    if (typeof className !== 'string') return [];

    const elements = [];
    this.__nodeIdMap.forEach((element, nodeId) => {
      const classNames = className.trim().split(/\s+/);
      if (element && classNames.every(c => element.classList.has(c))) {
        elements.push(element);
      }
    });
    return elements;
  }

  querySelector(selector) {
    if (typeof selector !== 'string') return;

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

  createElement(tagName) {
    if (typeof tagName !== 'string' || !tagName) return;

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

    return new TextNode({
      content,
      nodeId: `b-${tool.getId()}`,
      document: this
    });
  }

  createComment() {
    return new Comment({
      nodeId: `b-${tool.getId()}`,
      document: this
    });
  }

  createDocumentFragment() {
    return new Element({
      tagName: 'documentfragment',
      nodeId: `b-${tool.getId()}`,
      nodeType: Node.DOCUMENT_FRAGMENT_NODE,
      document: this
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
