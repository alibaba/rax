import Host from './host';
import NativeComponent from './native';
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

    const fragment = [];
    this.__mountChildrenImpl(this._parent, this.__currentElement, context, (nativeNode) => {
      nativeNode = toArray(nativeNode);
      for (let i = 0; i < nativeNode.length; i++) {
        fragment.push(nativeNode[i]);
      }
    });
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

  unmountComponent(shouldNotRemoveChild) {
    if (!shouldNotRemoveChild) {
      const nativeNode = this.__getNativeNode();
      for (let i = 0, l = nativeNode.length; i < l; i++) {
        Host.driver.removeChild(nativeNode[i]);
      }
    }

    // Do not need remove child when their parent is removed
    this.__unmountChildren(true);
    this.__destoryComponent();
  }

  __updateComponent(prevElement, nextElement, prevContext, nextContext) {
    // Replace current element
    this.__currentElement = nextElement;
    this.__updateChildren(this.__currentElement, nextContext);

    if (process.env.NODE_ENV !== 'production') {
      this.__currentElement.type = FragmentComponent;
      Host.reconciler.receiveComponent(this);
    }
  }

  __getNativeNode() {
    const renderedChildren = this.__renderedChildren || {};
    return [].concat.apply([], Object.keys(renderedChildren).map(key => renderedChildren[key].__getNativeNode()));
  }
}

if (process.env.NODE_ENV !== 'production') {
  FragmentComponent.displayName = 'Fragment';
}

export default FragmentComponent;
