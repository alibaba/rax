import ReactiveComponent from './reactive';
import updater from './updater';
import Host from './host';
import { attachRef, updateRef, detachRef } from './ref';
import instantiateComponent from './instantiateComponent';
import shouldUpdateComponent from './shouldUpdateComponent';
import shallowEqual from './shallowEqual';
import BaseComponent from './base';
import getPrevSiblingNativeNode from './getPrevSiblingNativeNode';
import performInSandbox from './performInSandbox';
import toArray from '../toArray';
import { scheduleLayout } from './scheduler';
import { isFunction, isArray } from '../types';
import assign from '../assign';
import { INSTANCE, INTERNAL, RENDERED_COMPONENT } from '../constant';
import invokeFunctionsWithContext from '../invokeFunctionsWithContext';
import validateChildKeys from '../validateChildKeys';
import { throwError, throwMinifiedError } from '../error';

let measureLifeCycle;
if (process.env.NODE_ENV !== 'production') {
  measureLifeCycle = function(callback, instanceID, type) {
    Host.measurer && Host.measurer.beforeLifeCycle(instanceID, type);
    callback();
    Host.measurer && Host.measurer.afterLifeCycle(instanceID, type);
  };
}

function scheduleLayoutInSandbox(fn, instance) {
  scheduleLayout(() => {
    performInSandbox(fn, instance);
  });
}

function scheduleLayoutCallbacksInSandbox(callbacks, instance) {
  if (callbacks) {
    scheduleLayoutInSandbox(() => {
      invokeFunctionsWithContext(callbacks, instance);
    }, instance);
  }
}

/**
 * Composite Component
 */
class CompositeComponent extends BaseComponent {
  __mountComponent(parent, parentInstance, context, nativeNodeMounter) {
    this.__initComponent(parent, parentInstance, context);

    if (process.env.NODE_ENV !== 'production') {
      this._updateCount = 0;
      Host.measurer && Host.measurer.beforeMountComponent(this._mountID, this);
    }

    let currentElement = this.__currentElement;
    let Component = currentElement.type;
    let ref = currentElement.ref;
    let publicProps = currentElement.props;
    let componentPrototype = Component.prototype;

    // Context process
    let publicContext = this.__processContext(context);

    // Initialize the public class
    let instance;
    let renderedElement;

    performInSandbox(() => {
      if (componentPrototype && componentPrototype.render) {
        // Class Component instance
        instance = new Component(publicProps, publicContext);
      } else if (isFunction(Component)) {
        // Functional reactive component with hooks
        instance = new ReactiveComponent(Component, ref);
      } else {
        if (process.env.NODE_ENV !== 'production') {
          throwError('Invalid component type, expected a class or function component.', Component);
        } else {
          throwMinifiedError(6, Component);
        }
      }
    }, parentInstance);

    if (!instance) {
      return;
    }

    // These should be set up in the constructor, but as a convenience for
    // simpler class abstractions, we set them up after the fact.
    instance.props = publicProps;
    instance.context = publicContext;
    instance.refs = {};

    // Inject the updater into instance
    instance.updater = updater;
    instance[INTERNAL] = this;
    this[INSTANCE] = instance;

    // Init state, must be set to an object or null
    let initialState = instance.state;
    if (initialState === undefined) {
      // TODO clone the state?
      instance.state = initialState = null;
    }

    if (instance.componentWillMount) {
      performInSandbox(() => {
        if (process.env.NODE_ENV !== 'production') {
          measureLifeCycle(() => {
            instance.componentWillMount();
          }, this._mountID, 'componentWillMount');
        } else {
          instance.componentWillMount();
        }
      }, instance);
    }

    Host.owner = this;
    // Process pending state when call setState in componentWillMount
    instance.state = this.__processPendingState(publicProps, publicContext);
    const callbacks = this.__pendingCallbacks;
    this.__pendingCallbacks = null;

    performInSandbox(() => {
      if (process.env.NODE_ENV !== 'production') {
        measureLifeCycle(() => {
          renderedElement = instance.render();
        }, this._mountID, 'render');
      } else {
        renderedElement = instance.render();
      }
    }, instance);

    if (process.env.NODE_ENV !== 'production') {
      validateChildKeys(renderedElement, this.__currentElement.type);
    }

    Host.owner = null;

    this[RENDERED_COMPONENT] = instantiateComponent(renderedElement);
    this[RENDERED_COMPONENT].__mountComponent(
      this._parent,
      instance,
      this.__processChildContext(context),
      nativeNodeMounter
    );

    if (!currentElement.type._forwardRef && ref) {
      attachRef(currentElement._owner, ref, this);
    }

    if (instance.componentDidMount) {
      scheduleLayoutInSandbox(() => {
        if (process.env.NODE_ENV !== 'production') {
          measureLifeCycle(() => {
            instance.componentDidMount();
          }, this._mountID, 'componentDidMount');
        } else {
          instance.componentDidMount();
        }
      }, instance);
    }

    // Trigger setState callback
    scheduleLayoutCallbacksInSandbox(callbacks, instance);

    if (process.env.NODE_ENV !== 'production') {
      scheduleLayout(() => {
        Host.reconciler.mountComponent(this);
        Host.measurer && Host.measurer.afterMountComponent(this._mountID);
      });
    }

    return instance;
  }

  unmountComponent(shouldNotRemoveChild) {
    let instance = this[INSTANCE];

    // Unmounting a composite component maybe not complete mounted
    // when throw error in component constructor stage
    if (instance && instance.componentWillUnmount) {
      performInSandbox(() => {
        instance.componentWillUnmount();
      }, instance);
    }

    if (this[RENDERED_COMPONENT] != null) {
      let currentElement = this.__currentElement;
      let ref = currentElement.ref;

      if (!currentElement.type._forwardRef && ref) {
        detachRef(currentElement._owner, ref, this);
      }

      this[RENDERED_COMPONENT].unmountComponent(shouldNotRemoveChild);
      this[RENDERED_COMPONENT] = null;
    }

    // Reset pending fields
    // Even if this component is scheduled for another async update,
    // it would still be ignored because these fields are reset.
    this.__pendingStateQueue = null;
    this.__isPendingForceUpdate = false;

    this.__destoryComponent();
  }

  /**
   * Filters the context object to only contain keys specified in
   * `contextTypes`
   */
  __processContext(context) {
    let maskedContext = {};
    let Component = this.__currentElement.type;
    let contextTypes = Component.contextTypes;

    if (contextTypes) {
      for (let contextName in contextTypes) {
        maskedContext[contextName] = context[contextName];
      }
    }

    return maskedContext;
  }

  __processChildContext(currentContext) {
    let instance = this[INSTANCE];
    // The getChildContext method context should be current instance
    let childContext = instance.getChildContext && instance.getChildContext();
    if (childContext) {
      return assign({}, currentContext, childContext);
    }

    return currentContext;
  }

  __processPendingState(props, context) {
    let instance = this[INSTANCE];
    let queue = this.__pendingStateQueue;
    if (!queue) {
      return instance.state;
    }
    // Reset pending queue
    this.__pendingStateQueue = null;
    let nextState = assign({}, instance.state);
    for (let i = 0; i < queue.length; i++) {
      let partial = queue[i];
      assign(
        nextState,
        isFunction(partial) ?
          partial.call(instance, nextState, props, context) :
          partial
      );
    }

    return nextState;
  }

  __updateComponent(
    prevElement,
    nextElement,
    prevUnmaskedContext,
    nextUnmaskedContext
  ) {
    let instance = this[INSTANCE];

    // Maybe update component that has already been unmounted or failed mount.
    if (!instance) {
      return;
    }

    performInSandbox(() => {
      if (process.env.NODE_ENV !== 'production') {
        Host.measurer && Host.measurer.beforeUpdateComponent(this._mountID, this);
      }

      let willReceive;
      let nextContext;
      let nextProps;

      // Determine if the context has changed or not
      if (this._context === nextUnmaskedContext) {
        nextContext = instance.context;
      } else {
        nextContext = this.__processContext(nextUnmaskedContext);
        willReceive = true;
      }

      // Distinguish between a props update versus a simple state update
      // Skip checking prop types again -- we don't read component.props to avoid
      // warning for DOM component props in this upgrade
      nextProps = nextElement.props;

      if (prevElement !== nextElement) {
        willReceive = true;
      }

      if (willReceive && instance.componentWillReceiveProps) {
        // Calling this.setState() within componentWillReceiveProps will not trigger an additional render.
        this.__isPendingState = true;
        instance.componentWillReceiveProps(nextProps, nextContext);
        this.__isPendingState = false;
      }

      // Update refs
      if (this.__currentElement.type._forwardRef) {
        instance.__prevForwardRef = prevElement.ref;
        instance._forwardRef = nextElement.ref;
      } else {
        updateRef(prevElement, nextElement, this);
      }

      // Shoud update default
      let shouldUpdate = true;
      let prevProps = instance.props;
      let prevState = instance.state;
      // TODO: could delay execution processPendingState
      let nextState = this.__processPendingState(nextProps, nextContext);
      const callbacks = this.__pendingCallbacks;
      this.__pendingCallbacks = null;

      // ShouldComponentUpdate is not called when forceUpdate is used
      if (!this.__isPendingForceUpdate) {
        if (instance.shouldComponentUpdate) {
          shouldUpdate = instance.shouldComponentUpdate(nextProps, nextState, nextContext);
        } else if (instance.__isPureComponent) {
          // Pure Component
          shouldUpdate = !shallowEqual(prevProps, nextProps) ||
            !shallowEqual(prevState, nextState);
        }
      }

      if (shouldUpdate) {
        this.__isPendingForceUpdate = false;
        // Will set `this.props`, `this.state` and `this.context`.
        let prevContext = instance.context;

        // Cannot use this.setState() in componentWillUpdate.
        // If need to update state in response to a prop change, use componentWillReceiveProps instead.
        if (instance.componentWillUpdate) {
          instance.componentWillUpdate(nextProps, nextState, nextContext);
        }

        // Replace with next
        this.__currentElement = nextElement;
        this._context = nextUnmaskedContext;
        instance.props = nextProps;
        instance.state = nextState;
        instance.context = nextContext;

        this.__updateRenderedComponent(nextUnmaskedContext);

        if (instance.componentDidUpdate) {
          scheduleLayoutInSandbox(() => {
            instance.componentDidUpdate(prevProps, prevState, prevContext);
          }, instance);
        }

        if (process.env.NODE_ENV !== 'production') {
          // Calc update count.
          this._updateCount++;
        }
      } else {
        // If it's determined that a component should not update, we still want
        // to set props and state but we shortcut the rest of the update.
        this.__currentElement = nextElement;
        this._context = nextUnmaskedContext;
        instance.props = nextProps;
        instance.state = nextState;
        instance.context = nextContext;
      }

      scheduleLayoutCallbacksInSandbox(callbacks, instance);

      if (process.env.NODE_ENV !== 'production') {
        scheduleLayout(() => {
          Host.measurer && Host.measurer.afterUpdateComponent(this._mountID);
          Host.reconciler.receiveComponent(this);
        });
      }
    }, instance);
  }

  /**
   * Call the component's `render` method and update the DOM accordingly.
   */
  __updateRenderedComponent(context) {
    let prevRenderedComponent = this[RENDERED_COMPONENT];
    let prevRenderedElement = prevRenderedComponent.__currentElement;

    let instance = this[INSTANCE];
    let nextRenderedElement;

    Host.owner = this;

    if (process.env.NODE_ENV !== 'production') {
      measureLifeCycle(() => {
        nextRenderedElement = instance.render();
      }, this._mountID, 'render');
    } else {
      nextRenderedElement = instance.render();
    }

    Host.owner = null;

    if (shouldUpdateComponent(prevRenderedElement, nextRenderedElement)) {
      const prevRenderedUnmaskedContext = prevRenderedComponent._context;
      const nextRenderedUnmaskedContext = this.__processChildContext(context);
      // If getChildContext existed and invoked when component updated that will make
      // prevRenderedUnmaskedContext not equal nextRenderedUnmaskedContext under the tree
      if (prevRenderedElement !== nextRenderedElement || prevRenderedUnmaskedContext !== nextRenderedUnmaskedContext) {
        // If element type is illegal catch the error
        prevRenderedComponent.__updateComponent(
          prevRenderedElement,
          nextRenderedElement,
          prevRenderedUnmaskedContext,
          nextRenderedUnmaskedContext
        );
      }

      if (process.env.NODE_ENV !== 'production') {
        Host.measurer && Host.measurer.recordOperation({
          instanceID: this._mountID,
          type: 'update component',
          payload: {}
        });
      }
    } else {
      let lastNativeNode = null;
      let prevNativeNode = prevRenderedComponent.__getNativeNode();
      // Only prevNativeNode is empty fragment should find the prevSlibingNativeNode
      // And current root component is fragment, but not need find the prevSlibingNativeNode when init mounting
      if (isArray(prevNativeNode) && prevNativeNode.length === 0 && instance.__rootID == null) {
        lastNativeNode = getPrevSiblingNativeNode(prevRenderedComponent);
      }

      prevRenderedComponent.unmountComponent(true);

      this[RENDERED_COMPONENT] = instantiateComponent(nextRenderedElement);
      this[RENDERED_COMPONENT].__mountComponent(
        this._parent,
        instance,
        this.__processChildContext(context),
        (newNativeNode, parent) => {
          const driver = Host.driver;

          prevNativeNode = toArray(prevNativeNode);
          newNativeNode = toArray(newNativeNode);

          // If the new length large then prev
          for (let i = 0; i < newNativeNode.length; i++) {
            let nativeNode = newNativeNode[i];
            if (prevNativeNode[i]) {
              driver.replaceChild(nativeNode, prevNativeNode[i]);
            } else if (lastNativeNode) {
              driver.insertAfter(nativeNode, lastNativeNode);
            } else {
              driver.appendChild(nativeNode, parent);
            }
            lastNativeNode = nativeNode;
          }

          // If the new length less then prev
          for (let i = newNativeNode.length; i < prevNativeNode.length; i++) {
            driver.removeChild(prevNativeNode[i]);
          }
        }
      );
    }
  }

  __getNativeNode() {
    let renderedComponent = this[RENDERED_COMPONENT];
    if (renderedComponent) {
      return renderedComponent.__getNativeNode();
    }
  }

  __getPublicInstance() {
    let instance = this[INSTANCE];

    // The functional components cannot be given refs
    if (instance.__isReactiveComponent) return null;

    return instance;
  }
}

export default CompositeComponent;
