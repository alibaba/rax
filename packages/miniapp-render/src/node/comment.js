import tool from '../utils/tool';
import Node from './node';

class Comment extends Node {
  static $$create(options, tree) {
    return new Comment(options, tree);
  }

  $$init(options, tree) {
    options.type = 'comment';

    super.$$init(options, tree);
  }

  $$recycle() {
    this.$$destroy();
  }

  get $$domInfo() {
    return {
      nodeId: this.$_nodeId,
      pageId: this.__pageId,
      type: this.$_type,
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
    });
  }
}

export default Comment;
