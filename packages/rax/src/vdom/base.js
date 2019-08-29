import Host from './host';
import {CURRENT_ELEMENT, INSTANCE, INTERNAL, NATIVE_NODE} from '../constant';

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
    this[NATIVE_NODE] = null;
    this._parent = null;
    this._parentInstance = null;
    this._context = null;

    if (this[INSTANCE]) {
      this[INSTANCE][INTERNAL] = null;
      this[INSTANCE] = null;
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
    if (this[NATIVE_NODE] && !shouldNotRemoveChild) {
      Host.driver.removeChild(this[NATIVE_NODE], this._parent);
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
    if (this[NATIVE_NODE] == null) {
      this[NATIVE_NODE] = this.createNativeNode();
    }

    return this[NATIVE_NODE];
  }

  getPublicInstance() {
    return this.getNativeNode();
  }
}
