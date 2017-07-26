import Host from './host';
import NativeComponent from './native';
import instance from './instance';
import instantiateComponent from './instantiateComponent';
import getElementKeyName from './getElementKeyName';

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
      let isFragmentParent = Array.isArray(parent);
      for (let i = 0; i < fragment.length; i++) {
        let child = fragment[i];
        // When the parent is also a fragment
        if (isFragmentParent) {
          parent.push(child);
        } else {
          Host.driver.appendChild(child, parent);
        }
      }
    }

    return instance;
  }


  mountChildren(children, context) {
    let renderedChildren = this._renderedChildren = {};
    let fragment = this.getNativeNode();

    let renderedChildrenImage = children.map((element, index) => {
      let renderedChild = instantiateComponent(element);
      let name = getElementKeyName(renderedChildren, element, index);
      renderedChildren[name] = renderedChild;
      renderedChild._mountIndex = index;
      // Mount
      let mountImage = renderedChild.mountComponent(
        this._parent,
        this._instance,
        context, (nativeNode) => {
          if (Array.isArray(nativeNode)) {
            for (let i = 0; i < nativeNode.length; i++) {
              fragment.push(nativeNode[i]);
            }
          } else {
            fragment.push(nativeNode);
          }
        }
      );
      return mountImage;
    });

    return renderedChildrenImage;
  }

  unmountComponent(notRemoveChild) {
    if (this._nativeNode) {
      instance.remove(this._nativeNode);
      if (!notRemoveChild) {
        for (let i = 0; i < this._nativeNode.length; i++) {
          Host.driver.removeChild(this._nativeNode[i]);
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
