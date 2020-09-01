import Element from '../element';

class BuiltInComponent extends Element {
  // Create instance
  constructor(options) {
    super(options);
    this._behavior = options.tagName;
  }

  get _behavior() {
    return this.__attrs.get('_behavior');
  }

  set _behavior(value) {
    this.__attrs.set('_behavior', value);
  }

  get _renderInfo() {
    return {
      nodeId: this.$$nodeId,
      pageId: this.__pageId,
      nodeType: this.$_type,
      tagName: this.$_tagName,
      style: this.style.cssText,
      ...this.__attrs.__value
    };
  }
}

export default BuiltInComponent;
