import Host from './host';
import { CURRENT_ELEMENT, INTERNAL } from '../constant';

/**
 * Base Component
 */
export default class BaseComponent {
  constructor(element) {
    this[CURRENT_ELEMENT] = element;
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

    this[CURRENT_ELEMENT] = null;
    this._nativeNode = null;
    this._parent = null;
    this._parentInstance = null;
    this._context = null;

    if (this._instance) {
      this._instance[INTERNAL] = null;
      this._instance = null;
    }
  }

  mountComponent(parent, parentInstance, context, nativeNodeMounter) {
    this.initComponent(parent, parentInstance, context);
    this.mountNativeNode(nativeNodeMounter);

    if (process.env.NODE_ENV !== 'production') {
      Host.reconciler.mountComponent(this);
    }

    const instance = {};
    instance[INTERNAL] = this;

    return instance;
  }

  unmountComponent(shouldNotRemoveChild) {
    if (this._nativeNode && !shouldNotRemoveChild) {
      Host.driver.removeChild(this._nativeNode, this._parent);
    }

    this.destoryComponent();
  }

  getName() {
    let currentElement = this[CURRENT_ELEMENT];
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
