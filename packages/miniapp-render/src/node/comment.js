import tool from '../utils/tool';
import Node from './node';

class Comment extends Node {
  static $$create(options) {
    return new Comment(options);
  }

  $$init(options) {
    options.type = 'comment';

    super.$$init(options);
  }

  $$recycle() {
    this.$$destroy();
  }

  get $$domInfo() {
    return {
      nodeId: this.$_nodeId,
      pageId: this.__pageId,
      nodeType: this.$_type,
    };
  }

  get nodeName() {
    return '#comment';
  }

  get nodeType() {
    return Node.COMMENT_NODE;
  }

  cloneNode() {
    return this.ownerDocument.$$createComment({
      nodeId: `b-${tool.getId()}`,
      document: this.ownerDocument
    });
  }
}

export default Comment;
