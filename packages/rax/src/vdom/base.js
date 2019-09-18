import Host from './host';
import { INSTANCE, INTERNAL, NATIVE_NODE } from '../constant';

/**
 * Base Component
 */
export default class BaseComponent {
  constructor(element) {
    this.__currentElement = element;
  }

  __initComponent(parent, parentInstance, context) {
    this._parent = parent;
    this.__parentInstance = parentInstance;
    this._context = context;
    this._mountID = Host.__mountID++;
  }

  __destoryComponent() {
    if (process.env.NODE_ENV !== 'production') {
      Host.reconciler.unmountComponent(this);
    }

    this.__currentElement
      = this[NATIVE_NODE]
      = this._parent
      = this.__parentInstance
      = this._context
      = null;

    if (this[INSTANCE]) {
      this[INSTANCE] = this[INSTANCE][INTERNAL] = null;
    }
  }

  __mountComponent(parent, parentInstance, context, nativeNodeMounter) {
    this.__initComponent(parent, parentInstance, context);
    this.__mountNativeNode(nativeNodeMounter);

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

    this.__destoryComponent();
  }

  __getName() {
    let currentElement = this.__currentElement;
    let type = currentElement && currentElement.type;

    return (
      type && type.displayName ||
      type && type.name ||
      type || // Native component's name is type
      currentElement
    );
  }

  __mountNativeNode(nativeNodeMounter) {
    let nativeNode = this.__getNativeNode();
    let parent = this._parent;

    if (nativeNodeMounter) {
      nativeNodeMounter(nativeNode, parent);
    } else {
      Host.driver.appendChild(nativeNode, parent);
    }
  }

  __getNativeNode() {
    return this[NATIVE_NODE] == null
      ? this[NATIVE_NODE] = this.__createNativeNode()
      : this[NATIVE_NODE];
  }

  __getPublicInstance() {
    return this.__getNativeNode();
  }
}
