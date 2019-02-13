import Host from './host';
import Ref from './ref';
import instantiateComponent from './instantiateComponent';
import shouldUpdateComponent from './shouldUpdateComponent';
import getElementKeyName from './getElementKeyName';
import Instance from './instance';

const STYLE = 'style';
const CHILDREN = 'children';
const TREE = 'tree';
const EVENT_PREFIX_REGEXP = /^on[A-Z]/;

/**
 * Native Component
 */
class NativeComponent {
  constructor(element) {
    this._currentElement = element;
  }

  mountComponent(parent, parentInstance, context, childMounter) {
    // Parent native element
    this._parent = parent;
    this._parentInstance = parentInstance;
    this._context = context;
    this._mountID = Host.mountID++;

    let props = this._currentElement.props;
    let type = this._currentElement.type;
    let instance = {
      _internal: this,
      type,
      props,
    };
    let appendType = props.append || TREE; // Default is node

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

    if (process.env.NODE_ENV !== 'production') {
      Host.hook.Reconciler.mountComponent(this);
    }

    return instance;
  }

  mountChildren(children, context) {
    if (!Array.isArray(children)) {
      children = [children];
    }

    let renderedChildren = this._renderedChildren = {};
    const nativeNode = this.getNativeNode();

    let renderedChildrenImage = children.map((element, index) => {
      let renderedChild = instantiateComponent(element);
      let name = getElementKeyName(renderedChildren, element, index);
      renderedChildren[name] = renderedChild;
      renderedChild._mountIndex = index;
      // Mount
      let mountImage = renderedChild.mountComponent(
        nativeNode,
        this._instance,
        context
      );
      return mountImage;
    });

    return renderedChildrenImage;
  }

  unmountChildren(notRemoveChild) {
    let renderedChildren = this._renderedChildren;

    if (renderedChildren) {
      for (let name in renderedChildren) {
        let renderedChild = renderedChildren[name];
        renderedChild.unmountComponent(notRemoveChild);
      }
      this._renderedChildren = null;
    }
  }

  unmountComponent(notRemoveChild) {
    if (this._nativeNode) {
      let ref = this._currentElement.ref;
      if (ref) {
        Ref.detach(this._currentElement._owner, ref, this);
      }

      Instance.remove(this._nativeNode);
      if (!notRemoveChild) {
        Host.driver.removeChild(this._nativeNode, this._parent);
      }
    }

    this.unmountChildren(notRemoveChild);

    if (process.env.NODE_ENV !== 'production') {
      Host.hook.Reconciler.unmountComponent(this);
    }

    this._currentElement = null;
    this._nativeNode = null;
    this._parent = null;
    this._parentInstance = null;
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

    if (process.env.NODE_ENV !== 'production') {
      Host.hook.Reconciler.receiveComponent(this);
    }
  }

  updateProperties(prevProps, nextProps) {
    let propKey;
    let styleName;
    let styleUpdates;
    const driver = Host.driver;
    const nativeNode = this.getNativeNode();

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
      } else if (EVENT_PREFIX_REGEXP.test(propKey)) {
        if (typeof prevProps[propKey] === 'function') {
          driver.removeEventListener(
            nativeNode,
            propKey.slice(2).toLowerCase(),
            prevProps[propKey]
          );
        }
      } else {
        driver.removeAttribute(
          nativeNode,
          propKey,
          prevProps[propKey]
        );
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
      } else if (EVENT_PREFIX_REGEXP.test(propKey)) {
        // Update event binding
        let eventName = propKey.slice(2).toLowerCase();

        if (typeof prevProp === 'function') {
          driver.removeEventListener(nativeNode, eventName, prevProp, nextProps);
        }

        if (typeof nextProp === 'function') {
          driver.addEventListener(nativeNode, eventName, nextProp, nextProps);
        }
      } else {
        // Update other property
        let payload = {};
        payload[propKey] = nextProp;
        if (nextProp != null) {
          driver.setAttribute(
            nativeNode,
            propKey,
            nextProp
          );
        } else {
          driver.removeAttribute(
            nativeNode,
            propKey,
            prevProps[propKey]
          );
        }
        if (process.env.NODE_ENV !== 'production') {
          Host.measurer && Host.measurer.recordOperation({
            instanceID: this._mountID,
            type: 'update attribute',
            payload: payload
          });
        }
      }
    }

    if (styleUpdates) {
      if (process.env.NODE_ENV !== 'production') {
        Host.measurer && Host.measurer.recordOperation({
          instanceID: this._mountID,
          type: 'update style',
          payload: styleUpdates
        });
      }
      driver.setStyles(nativeNode, styleUpdates);
    }
  }

  updateChildren(nextChildrenElements, context) {
    // prev rendered children
    let prevChildren = this._renderedChildren;
    let driver = Host.driver;

    if (nextChildrenElements == null && prevChildren == null) {
      return;
    }

    let nextChildren = {};

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
        let prevContext = prevChild && prevChild._context;

        // Try to update between the two of some name that has some element type,
        // and move child in next children loop if need
        if (prevChild != null && shouldUpdateComponent(prevElement, nextElement)) {
          if (prevElement !== nextElement || prevContext !== context) {
            // Pass the same context when updating chidren
            prevChild.updateComponent(prevElement, nextElement, context,
              context);
          }

          nextChildren[name] = prevChild;
        } else {
          // Unmount the prevChild when some name with nextChild but different element type,
          // and move child node in next children loop
          if (prevChild) {
            prevChild._unmount = true;
          }
          // The child must be instantiated before it's mounted.
          nextChildren[name] = instantiateComponent(nextElement);
        }
      }
    }

    let prevFirstChild;
    let prevFirstNativeNode;
    let shouldUnmountPrevFirstChild;

    // Unmount children that are no longer present.
    if (prevChildren != null) {
      for (let name in prevChildren) {
        if (!prevChildren.hasOwnProperty(name)) {
          continue;
        }

        let prevChild = prevChildren[name];
        let shouldUnmount = prevChild._unmount || !nextChildren[name];

        // Store old first child ref for append node ahead and maybe delay remove it
        if (!prevFirstChild) {
          shouldUnmountPrevFirstChild = shouldUnmount;
          prevFirstChild = prevChild;
          prevFirstNativeNode = prevFirstChild.getNativeNode();

          if (Array.isArray(prevFirstNativeNode)) {
            prevFirstNativeNode = prevFirstNativeNode[0];
          }
        } else if (shouldUnmount) {
          prevChild.unmountComponent();
        }
      }
    }

    if (nextChildren != null) {
      // `nextIndex` will increment for each child in `nextChildren`
      let nextIndex = 0;
      let lastIndex = 0;
      let lastPlacedNode = null;
      let nextNativeNode = [];

      function insertNodes(nativeNodes, parent) {
        // The nativeNodes maybe fragment, so convert to array type
        if (!Array.isArray(nativeNodes)) {
          nativeNodes = [nativeNodes];
        }

        if (lastPlacedNode) {
          // Should reverse order when insert new child after lastPlacedNode:
          // [lastPlacedNode, *newChild1, *newChild2]
          for (let i = nativeNodes.length - 1; i >= 0; i--) {
            driver.insertAfter(nativeNodes[i], lastPlacedNode);
          }
        } else if (prevFirstNativeNode) {
          // [*newChild1, *newChild2, prevFirstNativeNode]
          for (let i = 0; i < nativeNodes.length; i++) {
            driver.insertBefore(nativeNodes[i], prevFirstNativeNode);
          }
        } else if (parent) {
          // [*newChild1, *newChild2]
          for (let i = 0; i < nativeNodes.length; i++) {
            driver.appendChild(nativeNodes[i], parent);
          }
        }
      }

      for (let name in nextChildren) {
        if (!nextChildren.hasOwnProperty(name)) {
          continue;
        }

        let nextChild = nextChildren[name];
        let prevChild = prevChildren && prevChildren[name];

        // Try to move the some key prevChild but current not at the some position
        if (prevChild === nextChild) {
          let prevChildNativeNode = prevChild.getNativeNode();

          if (prevChild._mountIndex < lastIndex) {
            insertNodes(prevChildNativeNode);
          } else {
            lastIndex = prevChild._mountIndex;
          }
        } else {
          // Mount nextChild that in prevChildren there has no some name

          let parent = this.getNativeNode();
          // Fragment extended native component, so if parent is fragment should get this._parent
          if (Array.isArray(parent)) {
            parent = this._parent;
          }

          nextChild.mountComponent(
            parent,
            this._instance,
            context,
            insertNodes // Insert nodes mounter
          );
        }

        // Update to the latest mount order
        nextChild._mountIndex = nextIndex++;

        // Get the last child
        lastPlacedNode = nextChild.getNativeNode();
        // Push to nextNativeNode
        nextNativeNode = nextNativeNode.concat(lastPlacedNode);

        if (Array.isArray(lastPlacedNode)) {
          lastPlacedNode = lastPlacedNode[lastPlacedNode.length - 1];
        }
      }

      // Sync update native refs
      if (Array.isArray(this._nativeNode)) {
        // Clear all and push the new array
        this._nativeNode.splice(0, this._nativeNode.length);
        for (let i = 0; i < nextNativeNode.length; i++) {
          this._nativeNode.push(nextNativeNode[i]);
        }
      }
    }

    if (shouldUnmountPrevFirstChild) {
      prevFirstChild.unmountComponent();
    }

    this._renderedChildren = nextChildren;
  }

  getNativeNode() {
    if (this._nativeNode == null) {
      this._nativeNode = Host.driver.createElement(this._instance);
      Instance.set(this._nativeNode, this._instance);
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
