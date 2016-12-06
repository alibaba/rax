import Host from './host';

/**
 * Empty Component
 */
class EmptyComponent {
  constructor() {
    this._currentElement = null;
  }

  mountComponent(parent, context, childMounter) {
    this._parent = parent;
    this._context = context;

    let instance = {
      _internal: this
    };

    let nativeNode = this.getNativeNode();
    if (childMounter) {
      childMounter(nativeNode, parent);
    } else {
      Host.driver.appendChild(nativeNode, parent);
    }

    return instance;
  }

  unmountComponent(shouldNotRemoveChild) {
    if (this._nativeNode && !shouldNotRemoveChild) {
      Host.driver.removeChild(this._nativeNode, this._parent);
    }

    this._nativeNode = null;
    this._parent = null;
    this._context = null;
  }

  updateComponent() {
    // noop
  }

  getNativeNode() {
    // Weex native node
    if (this._nativeNode == null) {
      this._nativeNode = Host.driver.createEmpty();
    }

    return this._nativeNode;
  }
}

export default EmptyComponent;
