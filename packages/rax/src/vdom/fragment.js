import Host from './host';
import NativeComponent from './native';
import Instance from './instance';
import toArray from './toArray';

/**
 * Fragment Component
 */
class FragmentComponent extends NativeComponent {
  mountComponent(parent, parentInstance, context, nativeNodeMounter) {
    this.initComponent(parent, parentInstance, context);

    let instance = {
      _internal: this,
    };
    this._instance = instance;

    // Mount children
    this.mountChildren(this._currentElement, context);

    let fragment = this.getNativeNode();

    if (nativeNodeMounter) {
      nativeNodeMounter(fragment, parent);
    } else {
      for (let i = 0; i < fragment.length; i++) {
        Host.driver.appendChild(fragment[i], parent);
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      this._currentElement.type = FragmentComponent;
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
    this._currentElement = nextElement;
    this.updateChildren(this._currentElement, nextContext);

    if (process.env.NODE_ENV !== 'production') {
      this._currentElement.type = FragmentComponent;
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
