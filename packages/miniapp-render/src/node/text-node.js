import tool from '../utils/tool';
import Node from '../node/node';

class TextNode extends Node {
  static _create(options, tree) {
    return new TextNode(options, tree);
  }

  _init(options, tree) {
    options.type = 'text';

    super._init(options, tree);

    this.__content = options.content || '';
  }

  _destroy() {
    super._destroy();

    this.__content = '';
  }

  _recycle() {
    this._destroy();
  }

  _triggerUpdate(payload) {
    this._root && this._root.enqueueRender(payload);
  }

  get _domInfo() {
    return {
      nodeId: this.__nodeId,
      pageId: this.__pageId,
      nodeType: this.__type,
      content: this.__content,
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
    return this.__content;
  }

  set textContent(value) {
    value += '';

    this.__content = value;
    const payload = {
      path: `${this._path}.content`,
      value
    };
    this._triggerUpdate(payload);
  }

  get data() {
    return this.textContent;
  }

  set data(value) {
    this.textContent = value;
  }

  cloneNode() {
    return this.ownerDocument._createTextNode({
      content: this.__content,
      nodeId: `b-${tool.getId()}`,
    });
  }
}

export default TextNode;
