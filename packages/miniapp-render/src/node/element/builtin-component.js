import Element from '../element';

class BuiltInComponent extends Element {

  get _renderInfo() {
    return {
      nodeId: this.$$nodeId,
      nodeType: this.$_tagName,
      ...this.__attrs.__value,
      style: this.style.cssText,
      class: this.className,
    };
  }
}

export default BuiltInComponent;
