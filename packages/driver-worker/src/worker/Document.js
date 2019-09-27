import { DOCUMENT_NODE } from './NodeTypes';
import MutationObserver from './MutationObserver';
import Node from './Node';
import Element, { createElement, createElementNS, registerElement } from './Element';
import CanvasElement from './CanvasElement';
import Text from './Text';
import Event from './Event';
import Comment from './Comment';

registerElement('canvas', CanvasElement);

export function createDocument() {
  const document = new Document();
  document.appendChild(document.documentElement = createElement('html'));
  document.documentElement.appendChild(document.head = document.createElement('head'));
  document.documentElement.appendChild(document.body = document.createElement('body'));
  return document;
}

export default class Document extends Element {
  constructor() {
    super(DOCUMENT_NODE, '#DOCUMENT', null);

    this.defaultView = {
      document: this,
      MutationObserver,
      Document,
      Node,
      Text,
      Element,
      SVGElement: Element,
      Event,
      Comment,
    };
  }

  createElement(tagName) {
    return createElement(tagName);
  }

  createElementNS(namespaceURI, tagName) {
    return createElementNS(namespaceURI, tagName);
  }

  createComment(content) {
    return new Comment(content);
  }

  createTextNode(text) {
    return new Text(text);
  }

  getElementById(id) {
    // TODO
  }
}

