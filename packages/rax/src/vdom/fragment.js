import Host from './host';
import NativeComponent from './native';
import Instance from './instance';
import toArray from '../toArray';
import { INSTANCE, INTERNAL, NATIVE_NODE } from '../constant';

/**
 * Fragment Component
 */
class FragmentComponent extends NativeComponent {
  __mountComponent(parent, parentInstance, context, nativeNodeMounter) {
    this.__initComponent(parent, parentInstance, context);

    let instance = this[INSTANCE] = {};
    instance[INTERNAL] = this;

    // Mount children
    this.__mountChildren(this.__currentElement, context);

    let fragment = this.__getNativeNode();

    if (nativeNodeMounter) {
      nativeNodeMounter(fragment, parent);
    } else {
      for (let i = 0; i < fragment.length; i++) {
        Host.driver.appendChild(fragment[i], parent);
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      this.__currentElement.type = FragmentComponent;
      Host.reconciler.mountComponent(this);
    }

    return instance;
  }

  __mountChildren(children, context) {
    let fragment = this.__getNativeNode();

    return this.__mountChildrenImpl(this._parent, children, context, (nativeNode) => {
      let node;
      nativeNode = toArray(nativeNode);
      while (node = nativeNode.shift()) {
        fragment.push(node);
      }
    });
  }

  unmountComponent(shouldNotRemoveChild) {
    let nativeNode = this[NATIVE_NODE];

    if (nativeNode) {
      Instance.remove(nativeNode);

      if (!shouldNotRemoveChild) {
        for (let i = 0, l = nativeNode.length; i < l; i++) {
          Host.driver.removeChild(nativeNode[i]);
        }
      }
    }

    // Do not need remove child when their parent is removed
    this.__unmountChildren(true);

    this.__destoryComponent();
  }

  __updateComponent(prevElement, nextElement, prevContext, nextContext) {
    // Replace current element
    this.__currentElement = nextElement;

    if (prevElement.length === 0) {
      if (nextElement.length !== 0) {
        let lastNativeNode = Host.getHostPreviousSibling(this);
        let fragment = this.__getNativeNode();
        this.__mountChildrenImpl(this._parent, nextElement, nextContext, (nativeNode) => {
          nativeNode = toArray(nativeNode);
          let node;
          while (node = nativeNode.shift()) {
            fragment.push(node);
            if (lastNativeNode) {
              Host.driver.insertAfter(node, lastNativeNode);
            } else {
              Host.driver.appendChild(node, this._parent);
            }
            lastNativeNode = node;
          }
        });
      }
    } else {
      this.__updateChildren(this.__currentElement, nextContext);
    }

    if (process.env.NODE_ENV !== 'production') {
      this.__currentElement.type = FragmentComponent;
      Host.reconciler.receiveComponent(this);
    }
  }

  __createNativeNode() {
    return [];
  }
}

if (process.env.NODE_ENV !== 'production') {
  FragmentComponent.displayName = 'Fragment';
}

export default FragmentComponent;
