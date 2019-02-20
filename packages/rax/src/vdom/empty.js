import Host from './host';
import BaseComponent from './base';

/**
 * Empty Component
 */
class EmptyComponent extends BaseComponent {
  mountComponent(parent, parentInstance, context, childMounter) {
    this.initComponent(parent, parentInstance, context);

    let nativeNode = this.getNativeNode();
    if (childMounter) {
      childMounter(nativeNode, parent);
    } else {
      Host.driver.appendChild(nativeNode, parent);
    }

    let instance = {
      _internal: this
    };

    return instance;
  }

  unmountComponent(shouldNotRemoveChild) {
    if (this._nativeNode && !shouldNotRemoveChild) {
      Host.driver.removeChild(this._nativeNode, this._parent);
    }

    this.destoryComponent();
  }

  createNativeNode() {
    return Host.driver.createEmpty();
  }
}

export default EmptyComponent;
