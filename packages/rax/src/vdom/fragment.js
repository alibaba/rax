import Host from './host';
import NativeComponent from './native';
import instance from './instance';
import instantiateComponent from './instantiateComponent';
import getElementKeyName from './getElementKeyName';
import Hook from '../debug/hook';

/**
 * Fragment Component
 */
class FragmentComponent extends NativeComponent {
  constructor(element) {
    super(element);
  }

  mountComponent(parent, context, childMounter) {
    // Parent native element
    this._parent = parent;
    this._context = context;
    this._mountID = Host.mountID++;

    let instance = {
      _internal: this,
    };
    this._instance = instance;

    let nativeNode = this.getNativeNode();
    let children = this._currentElement;

    // Process children
    this.mountChildren(children, context);

    // Fragment child nodes append by tree mode
    if (childMounter) {
      childMounter(nativeNode, parent);
    } else {
      Host.driver.appendChild(nativeNode, parent);
    }

    // set to right node when append to parent
    this._nativeNode = parent;

    Hook.Reconciler.mountComponent(this);

    return instance;
  }


  mountChildren(children, context) {
    let renderedChildren = {};
    let fragment = this.getNativeNode();

    let renderedChildrenImage = children.map( (element, index) => {
      let renderedChild = instantiateComponent(element);
      let name = getElementKeyName(renderedChildren, element, index);
      renderedChildren[name] = renderedChild;
      renderedChild._mountIndex = index;
      // Mount
      let mountImage = renderedChild.mountComponent(
        this._parent,
        context,
        (nativeNode) => {
          Host.driver.appendChild(nativeNode, fragment);
        }
      );
      return mountImage;
    });

    this._renderedChildren = renderedChildren;

    return renderedChildrenImage;
  }

  unmountComponent(shouldNotRemoveChild) {
    if (this._nativeNode) {
      instance.remove(this._nativeNode);
      if (!shouldNotRemoveChild) {
        Host.driver.removeChild(this._nativeNode, this._parent);
      }
    }

    this.unmountChildren();

    Hook.Reconciler.unmountComponent(this);

    this._currentElement = null;
    this._nativeNode = null;
    this._parent = null;
    this._context = null;
    this._instance = null;
  }

  updateComponent(prevElement, nextElement, prevContext, nextContext) {
    // Replace current element
    this._currentElement = nextElement;
    this.updateChildren(this._currentElement, nextContext);

    Hook.Reconciler.receiveComponent(this);
  }

  getNativeNode() {
    if (this._nativeNode == null) {
      this._nativeNode = Host.driver.createFragment(this._instance);
      // TODO instance cache
    }

    return this._nativeNode;
  }

  getPublicInstance() {
    // TODO
    return null;
  }

  getName() {
    return 'fragment';
  }
}

export default FragmentComponent;
