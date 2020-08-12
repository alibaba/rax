import EventTarget from '../event/event-target';
import cache from '../utils/cache';

class Node extends EventTarget {
  /**
   * Override parent class _init method
   */
  _init(options, tree) {
    super._init();

    this.__nodeId = options.nodeId; // unique
    this.__type = options.type;
    this.__parentNode = null;
    this.__tree = tree;
    this.__pageId = tree.pageId;
  }

  /**
   * Override parent class _destroy method
   */
  _destroy() {
    super._destroy();

    this.__nodeId = null;
    this.__type = null;
    this.__parentNode = null;
    this.__tree = null;
    this.__pageId = null;
  }

  /**
   * private nodeId
   */
  get _nodeId() {
    return this.__nodeId;
  }

  /**
   * update parent node
   */
  _updateParent(parentNode = null) {
    this.__parentNode = parentNode;
  }

  get _path() {
    if (this.__parentNode !== null) {
      const index = '[' + this.__parentNode.childNodes.indexOf(this) + ']';

      return `${this.parentNode._path}.children.${index}`;
    }

    return '';
  }

  get _root() {
    if (this.__parentNode !== null) {
      return this.__parentNode._root;
    }

    return null;
  }

  get parentNode() {
    return this.__parentNode;
  }

  get nodeValue() {
    return null;
  }

  get previousSibling() {
    const childNodes = this.parentNode && this.parentNode.childNodes || [];
    const index = childNodes.indexOf(this);

    if (index > 0) {
      return childNodes[index - 1];
    }

    return null;
  }

  get previousElementSibling() {
    const childNodes = this.parentNode && this.parentNode.childNodes || [];
    const index = childNodes.indexOf(this);

    if (index > 0) {
      for (let i = index - 1; i >= 0; i--) {
        if (childNodes[i].nodeType === Node.ELEMENT_NODE) {
          return childNodes[i];
        }
      }
    }

    return null;
  }

  get nextSibling() {
    const childNodes = this.parentNode && this.parentNode.childNodes || [];
    const index = childNodes.indexOf(this);

    return childNodes[index + 1] || null;
  }

  get nextElementSibling() {
    const childNodes = this.parentNode && this.parentNode.childNodes || [];
    const index = childNodes.indexOf(this);

    if (index < childNodes.length - 1) {
      for (let i = index + 1, len = childNodes.length; i < len; i++) {
        if (childNodes[i].nodeType === Node.ELEMENT_NODE) {
          return childNodes[i];
        }
      }
    }

    return null;
  }

  get ownerDocument() {
    return cache.getDocument(this.__pageId) || null;
  }

  hasChildNodes() {
    return false;
  }

  remove() {
    if (!this.parentNode || !this.parentNode.removeChild) return this;

    return this.parentNode.removeChild(this);
  }
}

// static props
Node.ELEMENT_NODE = 1;
Node.TEXT_NODE = 3;
Node.CDATA_SECTION_NODE = 4;
Node.PROCESSING_INSTRUCTION_NODE = 7;
Node.COMMENT_NODE = 8;
Node.DOCUMENT_NODE = 9;
Node.DOCUMENT_TYPE_NODE = 10;
Node.DOCUMENT_FRAGMENT_NODE = 11;

export default Node;
