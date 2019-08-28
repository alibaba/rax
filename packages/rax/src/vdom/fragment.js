import Host from './host';
import NativeComponent from './native';
import Instance from './instance';
import toArray from './toArray';
import {CURRENT_ELEMENT, INSTANCE, INTERNAL} from '../constant';

/**
 * Fragment Component
 */
class FragmentComponent extends NativeComponent {
  mountComponent(parent, parentInstance, context, nativeNodeMounter) {
    this.initComponent(parent, parentInstance, context);

    let instance = {};
    instance[INTERNAL] = this;
    this[INSTANCE] = instance;

    // Mount children
    this.mountChildren(this[CURRENT_ELEMENT], context);

    let fragment = this.getNativeNode();

    if (nativeNodeMounter) {
      nativeNodeMounter(fragment, parent);
    } else {
      for (let i = 0; i < fragment.length; i++) {
        Host.driver.appendChild(fragment[i], parent);
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      this[CURRENT_ELEMENT].type = FragmentComponent;
      Host.reconciler.mountComponent(this);
    }

    return instance;
  }

  mountChildren(children, context) {
    let fragment = this.getNativeNode();

    return this._mountChildren(this._parent, children, context, (nativeNode) => {
      nativeNode = toArray(nativeNode);

      for (let i = 0; i < nativeNode.length; i++) {
        fragment.push(nativeNode[i]);
      }
    });
  }

  unmountComponent(shouldNotRemoveChild) {
    let nativeNode = this._nativeNode;

    if (nativeNode) {
      Instance.remove(nativeNode);

      if (!shouldNotRemoveChild) {
        for (let i = 0; i < nativeNode.length; i++) {
          Host.driver.removeChild(nativeNode[i]);
        }
      }
    }

    // Do not need remove child when their parent is removed
    this.unmountChildren(true);

    this.destoryComponent();
  }

  updateComponent(prevElement, nextElement, prevContext, nextContext) {
    // Replace current element
    this[CURRENT_ELEMENT] = nextElement;
    this.updateChildren(this[CURRENT_ELEMENT], nextContext);

    if (process.env.NODE_ENV !== 'production') {
      this[CURRENT_ELEMENT].type = FragmentComponent;
      Host.reconciler.receiveComponent(this);
    }
  }

  createNativeNode() {
    return [];
  }
}

if (process.env.NODE_ENV !== 'production') {
  FragmentComponent.displayName = 'Fragment';
}

export default FragmentComponent;
