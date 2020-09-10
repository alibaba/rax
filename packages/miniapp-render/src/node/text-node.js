import tool from '../utils/tool';
import Node from '../node/node';

class TextNode extends Node {
  constructor(options) {
    options.type = 'text';

    super(options);

    this.$_content = options.content || '';
  }

  $$destroy() {
    super.$$destroy();

    this.$_content = '';
  }

  _triggerUpdate(payload) {
    this._root.enqueueRender(payload);
  }

  get _renderInfo() {
    return {
      nodeType: `h-${this.$_type}`,
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
    if (this._isRendered()) {
      const payload = {
        path: `${this._path}.content`,
        value
      };
      this._triggerUpdate(payload);
    }
  }

  get data() {
    return this.textContent;
  }

  set data(value) {
    this.textContent = value;
  }

  cloneNode() {
    return this.ownerDocument.createTextNode(this.$_content);
  }
}

export default TextNode;
