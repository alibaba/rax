import Pool from '../util/pool';
import cache from '../util/cache';
import tool from '../util/tool';
import Node from './node';

const pool = new Pool();

class Comment extends Node {
  static $$create(options, tree) {
    const config = cache.getConfig();

    if (config.optimization.commentMultiplexing) {
      const instance = pool.get();

      if (instance) {
        instance.$$init(options, tree);
        return instance;
      }
    }

    return new Comment(options, tree);
  }

  $$init(options, tree) {
    options.type = 'comment';

    super.$$init(options, tree);
  }

  $$recycle() {
    this.$$destroy();

    const config = cache.getConfig();

    if (config.optimization.commentMultiplexing) {
      pool.add(this);
    }
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
