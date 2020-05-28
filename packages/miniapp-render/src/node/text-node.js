import Pool from '../utils/pool';
import cache from '../utils/cache';
import tool from '../utils/tool';
import Node from '../node/node';

const pool = new Pool();

class TextNode extends Node {
  static $$create(options, tree) {
    const config = cache.getConfig();

    if (config.optimization.textMultiplexing) {
      const instance = pool.get();

      if (instance) {
        instance.$$init(options, tree);
        return instance;
      }
    }

    return new TextNode(options, tree);
  }

  $$init(options, tree) {
    options.type = 'text';

    super.$$init(options, tree);

    this.$_content = options.content || '';
  }

  $$destroy() {
    super.$$destroy();

    this.$_content = '';
  }

  $$recycle() {
    this.$$destroy();

    const config = cache.getConfig();

    if (config.optimization.textMultiplexing) {
      pool.add(this);
    }
  }

  $_triggerParentUpdate(payload) {
    this._root.enqueueRender(payload);
    // if (this.parentNode) this.parentNode.$$trigger('$$childNodesUpdate');
  }

  get $$domInfo() {
    return {
      nodeId: this.$_nodeId,
      pageId: this.__pageId,
      type: this.$_type,
      content: this.$_content,
    };
  }

  get nodeName() {
    return '#text';
  }

  get nodeType() {
    return Node.TEXT_NODE;
  }

  get nodeValue() {
    return this.textContent;
  }

  set nodeValue(value) {
    this.textContent = value;
  }

  get textContent() {
    return this.$_content;
  }

  set textContent(value) {
    value += '';

    this.$_content = value;
    const payload = {
      path: `${this._path}.text`,
      value
    }
    this.$_triggerParentUpdate(payload);
  }

  get data() {
    return this.textContent;
  }

  set data(value) {
    this.textContent = value;
  }

  cloneNode() {
    return this.ownerDocument.$$createTextNode({
      content: this.$_content,
      nodeId: `b-${tool.getId()}`,
    });
  }
}

export default TextNode;
