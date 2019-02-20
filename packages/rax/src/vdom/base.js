import Host from './host';

/**
 * Base Component
 */
class BaseComponent {
  constructor(element) {
    this._currentElement = element;
  }

  initComponent(parent, parentInstance, context) {
    this._parent = parent;
    this._parentInstance = parentInstance;
    this._context = context;
    this._mountID = Host.mountID++;
  }

  destoryComponent() {
    if (process.env.NODE_ENV !== 'production') {
      Host.hook.Reconciler.unmountComponent(this);
    }

    this._currentElement = null;
    this._nativeNode = null;
    this._parent = null;
    this._parentInstance = null;
    this._context = null;

    if (this._instance) {
      this._instance._internal = null;
      this._instance = null;
    }
  }

  updateComponent() {
    // Noop
  }

  getName() {
    let currentElement = this._currentElement;
    let instance = this._instance;

    let type = currentElement && currentElement.type;
    let constructor = instance && instance.constructor;

    return (
      type && type.displayName ||
      constructor && constructor.displayName ||
      type && type.name ||
      constructor && constructor.name ||
      type || // Native component's name is type
      currentElement
    );
  }

  getNativeNode() {
    if (this._nativeNode == null) {
      this._nativeNode = this.createNativeNode();
    }

    return this._nativeNode;
  }

  getPublicInstance() {
    return this.getNativeNode();
  }
}

export default BaseComponent;
