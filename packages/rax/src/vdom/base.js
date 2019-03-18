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
      Host.reconciler.unmountComponent(this);
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

  mountComponent(parent, parentInstance, context, nativeNodeMounter) {
    this.initComponent(parent, parentInstance, context);
    this.mountNativeNode(nativeNodeMounter);

    if (process.env.NODE_ENV !== 'production') {
      Host.reconciler.mountComponent(this);
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

  getName() {
    let currentElement = this._currentElement;
    let type = currentElement && currentElement.type;

    return (
      type && type.displayName ||
      type && type.name ||
      type || // Native component's name is type
      currentElement
    );
  }

  mountNativeNode(nativeNodeMounter) {
    let nativeNode = this.getNativeNode();
    let parent = this._parent;

    if (nativeNodeMounter) {
      nativeNodeMounter(nativeNode, parent);
    } else {
      Host.driver.appendChild(nativeNode, parent);
    }
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
