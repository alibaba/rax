import StatelessComponent from './stateless';
import updater from './updater';
import Host from './host';
import Ref from './ref';
import instantiateComponent from './instantiateComponent';
import shouldUpdateComponent from './shouldUpdateComponent';
import shallowEqual from './shallowEqual';

function performInSandbox(fn, instance, callback) {
  try {
    return fn();
  } catch (e) {
    if (callback) {
      callback(e);
    } else {
      handleError(instance, e);
    }
  }
}

function handleError(instance, error) {
  let boundary;
  let _instance = instance;

  while (_instance) {
    if (typeof _instance.componentDidCatch === 'function') {
      boundary = _instance;
      break;
    } else if (_instance._internal && _instance._internal._parentInstance) {
      _instance = _instance._internal._parentInstance;
    } else {
      break;
    }
  }

  if (boundary) {
    boundary.componentDidCatch(error);
  } else {
    if (Host.sandbox) {
      setTimeout(() => {
        throw error;
      }, 0);
    } else {
      throw error;
    }
  }
}

let measureLifeCycle;
if (process.env.NODE_ENV !== 'production') {
  measureLifeCycle = function(callback, instanceID, type) {
    Host.measurer && Host.measurer.beforeLifeCycle(instanceID, type);
    callback();
    Host.measurer && Host.measurer.afterLifeCycle(instanceID, type);
  };
}

/**
 * Composite Component
 */
class CompositeComponent {
  constructor(element) {
    this._currentElement = element;
  }

  getName() {
    let type = this._currentElement.type;
    let constructor = this._instance && this._instance.constructor;
    return (
      type.displayName || constructor && constructor.displayName ||
      type.name || constructor && constructor.name ||
      null
    );
  }

  mountComponent(parent, parentInstance, context, childMounter) {
    this._parent = parent;
    this._parentInstance = parentInstance;
    this._context = context;
    this._mountID = Host.mountID++;
    this._updateCount = 0;

    if (process.env.NODE_ENV !== 'production') {
      Host.measurer && Host.measurer.beforeMountComponent(this._mountID, this);
    }

    let Component = this._currentElement.type;
    let publicProps = this._currentElement.props;
    let isClass = Component.prototype;
    let isComponentClass = isClass && Component.prototype.isComponentClass;
    // Class stateless component without state but have lifecycles
    let isStatelessClass = isClass && Component.prototype.render;

    // Context process
    let publicContext = this._processContext(context);

    // Initialize the public class
    let instance;
    let renderedElement;

    if (isComponentClass || isStatelessClass) {
      // Component instance
      instance = new Component(publicProps, publicContext, updater);
    } else if (typeof Component === 'function') {
      // Functional stateless component without state and lifecycles
      instance = new StatelessComponent(Component);
    } else {
      throw Error(`Invalid component type ${JSON.stringify(Component)}`);
    }

    // These should be set up in the constructor, but as a convenience for
    // simpler class abstractions, we set them up after the fact.
    instance.props = publicProps;
    instance.context = publicContext;
    instance.refs = {};

    // Inject the updater into instance
    instance.updater = updater;
    instance._internal = this;
    this._instance = instance;

    // Init state, must be set to an object or null
    let initialState = instance.state;
    if (initialState === undefined) {
      // TODO clone the state?
      instance.state = initialState = null;
    }

    let error = null;
    let errorCallback = (e) => {
      error = e;
    };

    performInSandbox(() => {
      if (instance.componentWillMount) {
        if (process.env.NODE_ENV !== 'production') {
          measureLifeCycle(() => {
            instance.componentWillMount();
          }, this._mountID, 'componentDidMount');
        } else {
          instance.componentWillMount();
        }
      }
    }, instance, errorCallback);

    if (renderedElement == null) {
      Host.component = this;
      // Process pending state when call setState in componentWillMount
      instance.state = this._processPendingState(publicProps, publicContext);

      performInSandbox(() => {
        if (process.env.NODE_ENV !== 'production') {
          measureLifeCycle(() => {
            renderedElement = instance.render();
          }, this._mountID, 'render');
        } else {
          renderedElement = instance.render();
        }
      }, instance, errorCallback);

      Host.component = null;
    }

    this._renderedComponent = instantiateComponent(renderedElement);
    this._renderedComponent.mountComponent(
      this._parent,
      instance,
      this._processChildContext(context),
      childMounter
    );

    if (error) {
      handleError(instance, error);
    }

    if (this._currentElement && this._currentElement.ref) {
      Ref.attach(this._currentElement._owner, this._currentElement.ref, this);
    }

    performInSandbox(() => {
      if (instance.componentDidMount) {
        if (process.env.NODE_ENV !== 'production') {
          measureLifeCycle(() => {
            instance.componentDidMount();
          }, this._mountID, 'componentDidMount');
        } else {
          instance.componentDidMount();
        }
      }
    }, instance);

    Host.hook.Reconciler.mountComponent(this);

    if (process.env.NODE_ENV !== 'production') {
      Host.measurer && Host.measurer.afterMountComponent(this._mountID);
    }

    return instance;
  }

  unmountComponent(notRemoveChild) {
    let instance = this._instance;

    performInSandbox(() => {
      if (instance.componentWillUnmount) {
        instance.componentWillUnmount();
      }
    }, instance);

    Host.hook.Reconciler.unmountComponent(this);

    instance._internal = null;

    if (this._renderedComponent != null) {
      let ref = this._currentElement.ref;
      if (ref) {
        Ref.detach(this._currentElement._owner, ref, this);
      }

      this._renderedComponent.unmountComponent(notRemoveChild);
      this._renderedComponent = null;
      this._instance = null;
    }

    this._currentElement = null;
    this._parentInstance = null;

    // Reset pending fields
    // Even if this component is scheduled for another update in ReactUpdates,
    // it would still be ignored because these fields are reset.
    this._pendingStateQueue = null;
    this._pendingForceUpdate = false;

    // These fields do not really need to be reset since this object is no
    // longer accessible.
    this._context = null;
  }

  /**
   * Filters the context object to only contain keys specified in
   * `contextTypes`
   */
  _processContext(context) {
    let Component = this._currentElement.type;
    let contextTypes = Component.contextTypes;
    if (!contextTypes) {
      return {};
    }
    let maskedContext = {};
    for (let contextName in contextTypes) {
      maskedContext[contextName] = context[contextName];
    }
    return maskedContext;
  }

  _processChildContext(currentContext) {
    let instance = this._instance;
    let childContext = instance.getChildContext && instance.getChildContext();
    if (childContext) {
      return Object.assign({}, currentContext, childContext);
    }
    return currentContext;
  }

  _processPendingState(props, context) {
    let instance = this._instance;
    let queue = this._pendingStateQueue;
    if (!queue) {
      return instance.state;
    }
    // Reset pending queue
    this._pendingStateQueue = null;
    let nextState = Object.assign({}, instance.state);
    for (let i = 0; i < queue.length; i++) {
      let partial = queue[i];
      Object.assign(
        nextState,
        typeof partial === 'function' ?
        partial.call(instance, nextState, props, context) :
        partial
      );
    }

    return nextState;
  }

  updateComponent(
    prevElement,
    nextElement,
    prevUnmaskedContext,
    nextUnmaskedContext
  ) {
    let instance = this._instance;

    if (process.env.NODE_ENV !== 'production') {
      Host.measurer && Host.measurer.beforeUpdateComponent(this._mountID, this);
    }

    if (!instance) {
      console.error(
        `Update component '${this.getName()}' that has already been unmounted (or failed to mount).`
      );
    }

    let willReceive = false;
    let nextContext;
    let nextProps;

    // Determine if the context has changed or not
    if (this._context === nextUnmaskedContext) {
      nextContext = instance.context;
    } else {
      nextContext = this._processContext(nextUnmaskedContext);
      willReceive = true;
    }

    // Distinguish between a props update versus a simple state update
    if (prevElement === nextElement) {
      // Skip checking prop types again -- we don't read component.props to avoid
      // warning for DOM component props in this upgrade
      nextProps = nextElement.props;
    } else {
      nextProps = nextElement.props;
      willReceive = true;
    }

    let hasReceived = willReceive && instance.componentWillReceiveProps;

    if (hasReceived) {
      // Calling this.setState() within componentWillReceiveProps will not trigger an additional render.
      this._pendingState = true;
      performInSandbox(() => {
        instance.componentWillReceiveProps(nextProps, nextContext);
      }, instance);
      this._pendingState = false;
    }

    // Update refs
    Ref.update(prevElement, nextElement, this);

    // Shoud update always default
    let shouldUpdate = true;
    let prevProps = instance.props;
    let prevState = instance.state;
    // TODO: could delay execution processPendingState
    let nextState = this._processPendingState(nextProps, nextContext);

    // ShouldComponentUpdate is not called when forceUpdate is used
    if (!this._pendingForceUpdate) {
      if (instance.shouldComponentUpdate) {
        shouldUpdate = performInSandbox(() => {
          return instance.shouldComponentUpdate(nextProps, nextState,
            nextContext);
        }, instance);
      } else if (instance.isPureComponentClass) {
        shouldUpdate = !shallowEqual(prevProps, nextProps) || !shallowEqual(
          prevState, nextState);
      }
    }

    if (shouldUpdate) {
      this._pendingForceUpdate = false;
      // Will set `this.props`, `this.state` and `this.context`.
      let prevContext = instance.context;

      // Cannot use this.setState() in componentWillUpdate.
      // If need to update state in response to a prop change, use componentWillReceiveProps instead.
      performInSandbox(() => {
        if (instance.componentWillUpdate) {
          instance.componentWillUpdate(nextProps, nextState, nextContext);
        }
      }, instance);

      // Replace with next
      this._currentElement = nextElement;
      this._context = nextUnmaskedContext;
      instance.props = nextProps;
      instance.state = nextState;
      instance.context = nextContext;

      this._updateRenderedComponent(nextUnmaskedContext);

      performInSandbox(() => {
        if (instance.componentDidUpdate) {
          instance.componentDidUpdate(prevProps, prevState, prevContext);
        }
      }, instance);

      this._updateCount++;
    } else {
      // If it's determined that a component should not update, we still want
      // to set props and state but we shortcut the rest of the update.
      this._currentElement = nextElement;
      this._context = nextUnmaskedContext;
      instance.props = nextProps;
      instance.state = nextState;
      instance.context = nextContext;
    }

    // Flush setState callbacks set in componentWillReceiveProps
    if (hasReceived) {
      let callbacks = this._pendingCallbacks;
      this._pendingCallbacks = null;
      updater.runCallbacks(callbacks, instance);
    }

    if (process.env.NODE_ENV !== 'production') {
      Host.measurer && Host.measurer.afterUpdateComponent(this._mountID);
    }

    Host.hook.Reconciler.receiveComponent(this);
  }

  /**
   * Call the component's `render` method and update the DOM accordingly.
   */
  _updateRenderedComponent(context) {
    let prevRenderedComponent = this._renderedComponent;
    let prevRenderedElement = prevRenderedComponent._currentElement;

    let instance = this._instance;
    let nextRenderedElement;

    Host.component = this;

    performInSandbox(() => {
      if (process.env.NODE_ENV !== 'production') {
        measureLifeCycle(() => {
          nextRenderedElement = instance.render();
        }, this._mountID, 'render');
      } else {
        nextRenderedElement = instance.render();
      }
    }, instance);

    Host.component = null;

    if (shouldUpdateComponent(prevRenderedElement, nextRenderedElement)) {
      prevRenderedComponent.updateComponent(
        prevRenderedElement,
        nextRenderedElement,
        prevRenderedComponent._context,
        this._processChildContext(context)
      );
      if (process.env.NODE_ENV !== 'production') {
        Host.measurer && Host.measurer.recordOperation({
          instanceID: this._mountID,
          type: 'update component',
          payload: {}
        });
      }
    } else {
      let oldChild = prevRenderedComponent.getNativeNode();
      prevRenderedComponent.unmountComponent(true);

      this._renderedComponent = instantiateComponent(nextRenderedElement);
      this._renderedComponent.mountComponent(
        this._parent,
        instance,
        this._processChildContext(context),
        (newChild, parent) => {
          // TODO: Duplicate code in native component file
          if (!Array.isArray(newChild)) {
            newChild = [newChild];
          }

          // oldChild or newChild all maybe fragment
          if (!Array.isArray(oldChild)) {
            oldChild = [oldChild];
          }

          // If newChild count large then oldChild
          let lastNewChild;
          for (let i = 0; i < newChild.length; i++) {
            let child = newChild[i];
            if (oldChild[i]) {
              Host.driver.replaceChild(child, oldChild[i]);
            } else {
              Host.driver.insertAfter(child, lastNewChild);
            }
            lastNewChild = child;
          }

          // If newChild count less then oldChild
          if (newChild.length < oldChild.length) {
            for (let i = newChild.length; i < oldChild.length; i++) {
              Host.driver.removeChild(oldChild[i]);
            }
          }
        }
      );
    }
  }

  getNativeNode() {
    let renderedComponent = this._renderedComponent;
    if (renderedComponent) {
      return renderedComponent.getNativeNode();
    }
  }

  getPublicInstance() {
    let instance = this._instance;
    // The Stateless components cannot be given refs
    if (instance instanceof StatelessComponent) {
      return null;
    }
    return instance;
  }
}

export default CompositeComponent;
