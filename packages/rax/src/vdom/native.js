import Host from './host';
import Ref from './ref';
import instantiateComponent from './instantiateComponent';
import shouldUpdateComponent from './shouldUpdateComponent';
import getElementKeyName from './getElementKeyName';
import instance from './instance';
import Hook from '../debug/hook';

const STYLE = 'style';
const CHILDREN = 'children';
const TREE = 'tree';

/**
 * Native Component
 */
class NativeComponent {
  constructor(element) {
    this._currentElement = element;
  }

  mountComponent(parent, context, childMounter) {
    // Parent native element
    this._parent = parent;
    this._context = context;
    this._mountID = Host.mountID++;

    let props = this._currentElement.props;
    let type = this._currentElement.type;
    let instance = {
      _internal: this,
      type,
      props,
    };
    let appendType = props.append; // Default is node

    this._instance = instance;

    // Clone a copy for style diff
    this._prevStyleCopy = Object.assign({}, props.style);

    let nativeNode = this.getNativeNode();

    if (appendType !== TREE) {
      if (childMounter) {
        childMounter(nativeNode, parent);
      } else {
        Host.driver.appendChild(nativeNode, parent);
      }
    }

    if (this._currentElement && this._currentElement.ref) {
      Ref.attach(this._currentElement._owner, this._currentElement.ref, this);
    }

    // Process children
    let children = props.children;
    if (children != null) {
      this.mountChildren(children, context);
    }

    if (appendType === TREE) {
      if (childMounter) {
        childMounter(nativeNode, parent);
      } else {
        Host.driver.appendChild(nativeNode, parent);
      }
    }

    Hook.Reconciler.mountComponent(this);

    return instance;
  }

  mountChildren(children, context) {
    if (!Array.isArray(children)) {
      children = [children];
    }

    let renderedChildren = {};

    let renderedChildrenImage = children.map( (element, index) => {
      let renderedChild = instantiateComponent(element);
      let name = getElementKeyName(renderedChildren, element, index);
      renderedChildren[name] = renderedChild;
      renderedChild._mountIndex = index;
      // Mount
      let mountImage = renderedChild.mountComponent(this.getNativeNode(), context);
      return mountImage;
    });

    this._renderedChildren = renderedChildren;

    return renderedChildrenImage;
  }

  unmountChildren() {
    let renderedChildren = this._renderedChildren;

    if (renderedChildren) {
      for (let name in renderedChildren) {
        let renderedChild = renderedChildren[name];
        renderedChild.unmountComponent();
      }
      this._renderedChildren = null;
    }
  }

  unmountComponent(shouldNotRemoveChild) {
    if (this._nativeNode) {
      let ref = this._currentElement.ref;
      if (ref) {
        Ref.detach(this._currentElement._owner, ref, this);
      }

      instance.remove(this._nativeNode);
      if (!shouldNotRemoveChild) {
        Host.driver.removeChild(this._nativeNode, this._parent);
      }
      Host.driver.removeAllEventListeners(this._nativeNode);
    }

    this.unmountChildren();

    Hook.Reconciler.unmountComponent(this);

    this._currentElement = null;
    this._nativeNode = null;
    this._parent = null;
    this._context = null;
    this._instance = null;
    this._prevStyleCopy = null;
  }

  updateComponent(prevElement, nextElement, prevContext, nextContext) {
    // Replace current element
    this._currentElement = nextElement;

    Ref.update(prevElement, nextElement, this);

    let prevProps = prevElement.props;
    let nextProps = nextElement.props;

    this.updateProperties(prevProps, nextProps);
    this.updateChildren(nextProps.children, nextContext);

    Hook.Reconciler.receiveComponent(this);
  }

  updateProperties(prevProps, nextProps) {
    let propKey;
    let styleName;
    let styleUpdates;
    for (propKey in prevProps) {
      if (propKey === CHILDREN ||
          nextProps.hasOwnProperty(propKey) ||
         !prevProps.hasOwnProperty(propKey) ||
         prevProps[propKey] == null) {
        continue;
      }
      if (propKey === STYLE) {
        let lastStyle = this._prevStyleCopy;
        for (styleName in lastStyle) {
          if (lastStyle.hasOwnProperty(styleName)) {
            styleUpdates = styleUpdates || {};
            styleUpdates[styleName] = '';
          }
        }
        this._prevStyleCopy = null;
      } else if ( propKey.substring(0, 2) === 'on' ) {
        if (prevProps[propKey]) {
          Host.driver.removeEventListener(this.getNativeNode(), propKey.slice(2).toLowerCase(), prevProps[propKey]);
        }
      } else {
        Host.driver.removeAttribute(this.getNativeNode(), propKey, prevProps[propKey]);
      }
    }

    for (propKey in nextProps) {
      let nextProp = nextProps[propKey];
      let prevProp =
        propKey === STYLE ? this._prevStyleCopy :
        prevProps != null ? prevProps[propKey] : undefined;
      if (propKey === CHILDREN ||
          !nextProps.hasOwnProperty(propKey) ||
          nextProp === prevProp ||
          nextProp == null && prevProp == null) {
        continue;
      }
      // Update style
      if (propKey === STYLE) {
        if (nextProp) {
          // Clone property
          nextProp = this._prevStyleCopy = Object.assign({}, nextProp);
        } else {
          this._prevStyleCopy = null;
        }

        if (prevProp != null) {
          // Unset styles on `prevProp` but not on `nextProp`.
          for (styleName in prevProp) {
            if (prevProp.hasOwnProperty(styleName) &&
                (!nextProp || !nextProp.hasOwnProperty(styleName))) {
              styleUpdates = styleUpdates || {};
              styleUpdates[styleName] = '';
            }
          }
          // Update styles that changed since `prevProp`.
          for (styleName in nextProp) {
            if (nextProp.hasOwnProperty(styleName) &&
                prevProp[styleName] !== nextProp[styleName]) {
              styleUpdates = styleUpdates || {};
              styleUpdates[styleName] = nextProp[styleName];
            }
          }
        } else {
          // Assign next prop when prev style is null
          styleUpdates = nextProp;
        }

      // Update event binding
      } else if (propKey.substring(0, 2) === 'on') {
        if (prevProp != null) {
          Host.driver.removeEventListener(this.getNativeNode(), propKey.slice(2).toLowerCase(), prevProp);
        }

        if (nextProp != null) {
          Host.driver.addEventListener(this.getNativeNode(), propKey.slice(2).toLowerCase(), nextProp);
        }
      // Update other property
      } else {
        if (nextProp != null) {
          Host.driver.setAttribute(this.getNativeNode(), propKey, nextProp);
        } else {
          Host.driver.removeAttribute(this.getNativeNode(), propKey, prevProps[propKey]);
        }
      }
    }

    if (styleUpdates) {
      Host.driver.setStyles(this.getNativeNode(), styleUpdates);
    }
  }

  updateChildren(nextChildrenElements, context) {
    // prev rendered children
    let prevChildren = this._renderedChildren;

    if (nextChildrenElements == null && prevChildren == null) {
      return;
    }

    let nextChildren = {};
    let oldNodes = {};

    if (nextChildrenElements != null) {
      if (!Array.isArray(nextChildrenElements)) {
        nextChildrenElements = [nextChildrenElements];
      }

      // Update next children elements
      for (let index = 0, length = nextChildrenElements.length; index < length; index++) {
        let nextElement = nextChildrenElements[index];
        let name = getElementKeyName(nextChildren, nextElement, index);
        let prevChild = prevChildren && prevChildren[name];
        let prevElement = prevChild && prevChild._currentElement;

        if (prevChild != null && shouldUpdateComponent(prevElement, nextElement)) {
          // Pass the same context when updating chidren
          prevChild.updateComponent(prevElement, nextElement, context, context);
          nextChildren[name] = prevChild;
        } else {
          // Unmount the prevChild when nextChild is different element type.
          if (prevChild) {
            let oldChild = prevChild.getNativeNode();
            // Delay remove child
            prevChild.unmountComponent(true);
            oldNodes[name] = oldChild;
          }
          // The child must be instantiated before it's mounted.
          nextChildren[name] = instantiateComponent(nextElement);
        }
      }
    }

    // Unmount children that are no longer present.
    if (prevChildren != null) {
      for (let name in prevChildren) {
        if (!prevChildren.hasOwnProperty(name)) {
          continue;
        }
        let prevChild = prevChildren[name];
        if (!nextChildren[name]) {
          prevChild.unmountComponent();
        }
      }
    }

    if (nextChildren != null) {
      // `nextIndex` will increment for each child in `nextChildren`, but
      // `lastIndex` will be the last index visited in `prevChildren`.
      let lastIndex = 0;
      let nextIndex = 0;
      let lastPlacedNode = null;

      for (let name in nextChildren) {
        if (!nextChildren.hasOwnProperty(name)) {
          continue;
        }

        let nextChild = nextChildren[name];
        let prevChild = prevChildren && prevChildren[name];

        if (prevChild === nextChild) {
          // If the index of `child` is less than `lastIndex`, then it needs to
          // be moved. Otherwise, we do not need to move it because a child will be
          // inserted or moved before `child`.
          if (prevChild._mountIndex < lastIndex) {
            Host.driver.insertAfter(prevChild.getNativeNode(), lastPlacedNode, this.getNativeNode());
          }

          lastIndex = Math.max(prevChild._mountIndex, lastIndex);
          prevChild._mountIndex = nextIndex;
        } else {
          if (prevChild != null) {
            // Update `lastIndex` before `_mountIndex` gets unset by unmounting.
            lastIndex = Math.max(prevChild._mountIndex, lastIndex);
          }

          nextChild.mountComponent(
            this.getNativeNode(),
            context,
            (newChild, parent) => {
              let oldChild = oldNodes[name];

              if (oldChild) {
                Host.driver.replaceChild(newChild, oldChild, parent);
              } else if (lastPlacedNode) {
                Host.driver.insertAfter(newChild, lastPlacedNode, parent);
              } else {
                Host.driver.appendChild(newChild, parent);
              }
            }
          );
          nextChild._mountIndex = nextIndex;
        }

        nextIndex++;
        lastPlacedNode = nextChild.getNativeNode();
      }
    }

    this._renderedChildren = nextChildren;
  }

  getNativeNode() {
    if (this._nativeNode == null) {
      this._nativeNode = Host.driver.createElement(this._instance);
      instance.set(this._nativeNode, this._instance);
    }

    return this._nativeNode;
  }

  getPublicInstance() {
    return this.getNativeNode();
  }

  getName() {
    return this._currentElement.type;
  }
}

export default NativeComponent;
