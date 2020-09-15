import Node from './node';

class Comment extends Node {
  constructor(options) {
    options.type = 'comment';
    super(options);
    this.data = options.data;
  }

  get _renderInfo() {
    return {
      nodeType: 'h-' + this.$_type,
    };
  }

  get nodeName() {
    return '#comment';
  }

  get nodeType() {
    return Node.COMMENT_NODE;
  }

  cloneNode() {
    return this.ownerDocument.createComment({
      data: this.data
    });
  }
}

export default Comment;
