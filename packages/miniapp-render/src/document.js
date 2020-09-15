import EventTarget from './event/event-target';
import Node from './node/node';
import Element from './node/element';
import TextNode from './node/text-node';
import Comment from './node/comment';
import cache from './utils/cache';
import Image from './node/element/image';
import Input from './node/element/input';
import Textarea from './node/element/textarea';
import Video from './node/element/video';
import CustomComponent from './node/element/custom-component';
import RootElement from './node/root';
import { BODY_NODE_ID } from './constants';

const CONSTRUCTOR_MAP = new Map([['img', Image], ['input', Input], ['textarea', Textarea], ['video', Video]]);

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
      children: [],
      document: this,
    });

    this.__nodeIdMap.set(BODY_NODE_ID, this.__root);

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

  _createElement(options) {
    const ConstructorClass = CONSTRUCTOR_MAP.get(options.tagName);
    if (ConstructorClass) {
      return new ConstructorClass(options);
    }

    options.attrs = options.attrs || {};

    if (options.attrs.__native) {
      if (this.usingComponents[options.tagName]) {
        // Transform to custom-component
        options.nativeType = 'customComponent';
        return new CustomComponent(options);
      } else if (this.usingPlugins[options.tagName]) {
        options.nativeType = 'miniappPlugin';
        return new CustomComponent(options);
      }
    } else {
      return new Element(options);
    }
  }

  // Node type
  get nodeType() {
    return Node.DOCUMENT_NODE;
  }

  get documentElement() {
    return this.body;
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
      if (element && element.__tagName === tagName && element._isRendered()) {
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
      if (element && classNames.every(c => element.classList && element.classList.contains(c))) {
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
    return this._createElement({
      document: this,
      tagName
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
      document: this
    });
  }

  createComment(data) {
    return new Comment({
      document: this,
      data
    });
  }

  createDocumentFragment() {
    return new Element({
      tagName: 'documentfragment',
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
