import EventTarget from '../event/event-target';
import cache from '../util/cache';

class Node extends EventTarget {
  /**
   * Override parent class $$init method
   */
  $$init(options, tree) {
    super.$$init();

    this.$_nodeId = options.nodeId; // unique
    this.$_type = options.type;
    this.$_parentNode = null;
    this.$_tree = tree;
    this.$_pageId = tree.pageId;
  }

  /**
   * Override parent class $$destroy method
   */
  $$destroy() {
    super.$$destroy();

    this.$_nodeId = null;
    this.$_type = null;
    this.$_parentNode = null;
    this.$_tree = null;
    this.$_pageId = null;
  }

  /**
   * private nodeId
   */
  get $$nodeId() {
    return this.$_nodeId;
  }

  /**
   * private pageId
   */
  get $$pageId() {
    return this.$_pageId;
  }

  /**
   * update parent node
   */
  $$updateParent(parentNode = null) {
    this.$_parentNode = parentNode;
  }

  get parentNode() {
    return this.$_parentNode;
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
    return cache.getDocument(this.$_pageId) || null;
  }

  hasChildNodes() {
    return false;
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
