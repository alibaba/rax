import Host from './host';
import { INSTANCE, INTERNAL, NATIVE_NODE } from '../constant';

/**
 * Base Component
 */
export default class BaseComponent {
  constructor(element) {
    this.$_currentElement = element;
  }

  $_initComponent(parent, parentInstance, context) {
    this._parent = parent;
    this._parentInstance = parentInstance;
    this._context = context;
    this._mountID = Host.mountID++;
  }

  $_destoryComponent() {
    if (process.env.NODE_ENV !== 'production') {
      Host.reconciler.unmountComponent(this);
    }

    this.$_currentElement = null;
    this[NATIVE_NODE] = null;
    this._parent = null;
    this._parentInstance = null;
    this._context = null;

    if (this[INSTANCE]) {
      this[INSTANCE][INTERNAL] = null;
      this[INSTANCE] = null;
    }
  }

  $_mountComponent(parent, parentInstance, context, nativeNodeMounter) {
    this.$_initComponent(parent, parentInstance, context);
    this.$_mountNativeNode(nativeNodeMounter);

    if (process.env.NODE_ENV !== 'production') {
      Host.reconciler.mountComponent(this);
    }

    const instance = {};
    instance[INTERNAL] = this;

    return instance;
  }

  $_unmountComponent(shouldNotRemoveChild) {
    if (this[NATIVE_NODE] && !shouldNotRemoveChild) {
      Host.driver.removeChild(this[NATIVE_NODE], this._parent);
    }

    this.$_destoryComponent();
  }

  $_getName() {
    let currentElement = this.$_currentElement;
    let type = currentElement && currentElement.type;

    return (
      type && type.displayName ||
      type && type.name ||
      type || // Native component's name is type
      currentElement
    );
  }

  $_mountNativeNode(nativeNodeMounter) {
    let nativeNode = this.$_getNativeNode();
    let parent = this._parent;

    if (nativeNodeMounter) {
      nativeNodeMounter(nativeNode, parent);
    } else {
      Host.driver.appendChild(nativeNode, parent);
    }
  }

  $_getNativeNode() {
    if (this[NATIVE_NODE] == null) {
      this[NATIVE_NODE] = this.$_createNativeNode();
    }

    return this[NATIVE_NODE];
  }

  $_getPublicInstance() {
    return this.$_getNativeNode();
  }
}
