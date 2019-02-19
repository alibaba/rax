import Host from './host';
import NativeComponent from './native';
import Instance from './instance';

/**
 * Fragment Component
 */
class FragmentComponent extends NativeComponent {
  constructor(element) {
    super(element);
  }

  mountComponent(parent, parentInstance, context, childMounter) {
    // Parent native element
    this._parent = parent;
    this._parentInstance = parentInstance;
    this._context = context;
    this._mountID = Host.mountID++;

    let instance = {
      _internal: this,
    };
    this._instance = instance;

    let fragment = this.getNativeNode();
    let children = this._currentElement;

    // Process children
    this.mountChildren(children, context);

    if (childMounter) {
      childMounter(fragment, parent);
    } else {
      for (let i = 0; i < fragment.length; i++) {
        let child = fragment[i];
        Host.driver.appendChild(child, parent);
      }
    }

    return instance;
  }

  mountChildren(children, context) {
    let fragment = this.getNativeNode();

    return this._mountChildren(this._parent, children, context, (nativeNode) => {
      if (!Array.isArray(nativeNode)) {
        nativeNode = [nativeNode];
      }

      for (let i = 0; i < nativeNode.length; i++) {
        fragment.push(nativeNode[i]);
      }
    });
  }

  unmountComponent(notRemoveChild) {
    let nativeNode = this._nativeNode;

    if (nativeNode) {
      Instance.remove(nativeNode);

      if (!notRemoveChild) {
        for (let i = 0; i < nativeNode.length; i++) {
          Host.driver.removeChild(nativeNode[i]);
        }
      }
    }

    // Do not need remove child when their parent is removed
    this.unmountChildren(true);

    this._currentElement = null;
    this._nativeNode = null;
    this._parent = null;
    this._parentInstance = null;
    this._context = null;
    this._instance = null;
  }

  updateComponent(prevElement, nextElement, prevContext, nextContext) {
    // Replace current element
    this._currentElement = nextElement;
    this.updateChildren(this._currentElement, nextContext);
  }

  getNativeNode() {
    if (this._nativeNode == null) {
      this._nativeNode = [];
    }

    return this._nativeNode;
  }

  getPublicInstance() {
    return this.getNativeNode();
  }

  getName() {
    return 'fragment';
  }
}

export default FragmentComponent;
