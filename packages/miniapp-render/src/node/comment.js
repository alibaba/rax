import tool from '../utils/tool';
import Node from './node';

class Comment extends Node {
  static _create(options, tree) {
    return new Comment(options, tree);
  }

  _init(options, tree) {
    options.type = 'comment';

    super._init(options, tree);
  }

  _recycle() {
    this._destroy();
  }

  get _domInfo() {
    return {
      nodeId: this.__nodeId,
      pageId: this.__pageId,
      nodeType: this.__type,
    };
  }

  get nodeName() {
    return '#comment';
  }

  get nodeType() {
    return Node.COMMENT_NODE;
  }

  cloneNode() {
    return this.ownerDocument._createComment({
      nodeId: `b-${tool.getId()}`,
    });
  }
}

export default Comment;
