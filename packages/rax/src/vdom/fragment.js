import Host from './host';
import NativeComponent from './native';
import Instance from './instance';
import toArray from '../toArray';
import { INSTANCE, INTERNAL, NATIVE_NODE } from '../constant';
import getHostPreviousSibling from './getHostPreviousSibling';

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
        this.__mountChildren(this.__currentElement, nextContext);
        const nativeNodes = this.__getNativeNode();
        if (nativeNodes.length > 0) {
          const lastPlacedNode = getHostPreviousSibling(this);
          for (let i = 0, l = nativeNodes.length; i < l; i++) {
            if (lastPlacedNode) {
              Host.driver.insertAfter(nativeNodes[l - i - 1], lastPlacedNode);
            } else {
              Host.driver.appendChild(nativeNodes[i], this._parent);
            }
          }
        }
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
