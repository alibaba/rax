import Node from './Node';
import { ELEMENT_NODE } from './NodeTypes';
import { dispatchAnimationToStyle } from './Animation';
import { mutate } from './MutationObserver';
import camelCase from '../shared/camelCase';
import findWhere from '../shared/findWhere';
import splice from '../shared/splice';

const IS_DATASET_REG = /^data-/;
const elementConstructors = {};

export function registerElement(nodeName, elementConstructor) {
  elementConstructors[nodeName] = elementConstructor;
}

export function createElement(nodeName) {
  return createElementNS(null, nodeName);
}

export function createElementNS(namespaceURI, nodeName) {
  return new (elementConstructors[nodeName] || Element)(ELEMENT_NODE, nodeName, namespaceURI);
}

export function isElement(node) {
  return node && node.nodeType === ELEMENT_NODE;
}

function isDataset(attr) {
  return IS_DATASET_REG.test(attr.name);
}

function createAttributeFilter(ns, name) {
  return o => o.ns === ns && String(o.name).toLowerCase() === String(name).toLowerCase();
}

export default class Element extends Node {
  attributes = [];
  _style = {};

  constructor(nodeType, nodeName, namespaceURI) {
    super(nodeType || ELEMENT_NODE, nodeName.toUpperCase());
    this._namespace = namespaceURI;
  }

  set className(val) {
    this.setAttribute('class', val);
  }

  get className() {
    return this.getAttribute('class');
  }

  set id(val) {
    this.setAttribute('id', val);
  }

  get id() {
    return this.getAttribute('id');
  }

  set animation(queues) {
    if (Array.isArray(queues) && queues.length > 0) {
      const handleAnimationQueue = () => {
        if (queues.length > 0) {
          dispatchAnimationToStyle(this, queues.shift());
        } else {
          this.removeEventListener('transitionend', handleAnimationQueue);
        }
      };
      if (queues.length > 0) {
        dispatchAnimationToStyle(this, queues.shift());
        this.addEventListener('transitionend', handleAnimationQueue);
      }
    }
  }
  get animation() {
    return this.getAttribute('animation');
  }

  get children() {
    return this.childNodes.filter(isElement);
  }

  get dataset() {
    const dataset = {};
    this.attributes.filter(isDataset).forEach(({ name, value }) => {
      dataset[camelCase(name.slice(5))] = value;
    });
    return dataset;
  }

  get style() {
    return this._style;
  }

  set style(styleObject) {
    this._style = styleObject;
    mutate(this, 'attributes', { style: styleObject });
  }

  setAttribute(key, value) {
    if (value !== this.getAttribute(key)) {
      this.setAttributeNS(null, key, value);
    }
  }

  getAttribute(key) {
    return this.getAttributeNS(null, key);
  }

  removeAttribute(key) {
    this.removeAttributeNS(null, key);
  }

  setAttributeNS(ns, name, value) {
    let attr = findWhere(this.attributes, createAttributeFilter(ns, name));
    if (!attr) this.attributes.push(attr = { ns, name });

    attr.value = value;
    mutate(this, 'attributes', { attributeName: name, newValue: value });
  }

  getAttributeNS(ns, name) {
    let attr = findWhere(this.attributes, createAttributeFilter(ns, name));
    return attr && attr.value;
  }

  removeAttributeNS(ns, name) {
    splice(this.attributes, createAttributeFilter(ns, name));
    mutate(this, 'attributes', { attributeName: name });
  }
}
