import EventTarget from '../event/event-target';
import tool from '../utils/tool';
import cache from '../utils/cache';
import { BODY_NODE_ID } from '../constants';

class Node extends EventTarget {
  constructor(options) {
    super();

    // unique node id
    this.__nodeId = `n_${tool.getId()}`;
    this.$_type = options.type;
    this.parentNode = null;
    this.ownerDocument = options.document;
    this.__pageId = this.ownerDocument.__pageId;
  }

  /**
   * Override parent class $$destroy method
   */
  $$destroy() {
    super.$$destroy();

    this.__nodeId = null;
    this.$_type = null;
    this.parentNode = null;
    this.__pageId = null;
    this.__rendered = false;
  }

  get _path() {
    if (this.parentNode !== null) {
      const index = '[' + this.parentNode.childNodes.indexOf(this) + ']';

      return `${this.parentNode._path}.children.${index}`;
    }

    return '';
  }

  get _root() {
    return cache.getNode(this.__pageId, BODY_NODE_ID);
  }

  _isRendered() {
    if (this.__rendered) return true;
    if (this.parentNode) {
      this.__rendered = this.parentNode._isRendered();
    }
    return this.__rendered;
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
