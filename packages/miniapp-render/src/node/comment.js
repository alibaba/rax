import Node from './node';

class Comment extends Node {
  constructor(options) {
    options.type = 'comment';
    super(options);
  }

  get _renderInfo() {
    return {
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
    return this.ownerDocument.createComment();
  }
}

export default Comment;
