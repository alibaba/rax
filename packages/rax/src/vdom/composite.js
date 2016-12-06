import StatelessComponent from './stateless';
import updater from './updater';
import Host from './host';
import Ref from './ref';
import instantiateComponent from './instantiateComponent';
import shouldUpdateComponent from './shouldUpdateComponent';
import shallowEqual from './shallowEqual';
import Hook from '../debug/hook';

function performInSandbox(fn, handleError) {
  try {
    return fn();
  } catch (e) {
    if (handleError) {
      handleError(e);
    } else {
      setTimeout(() => {
        throw e;
      }, 0);
    }
  }
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

  mountComponent(parent, context, childMounter) {
    this._parent = parent;
    this._context = context;
    this._mountID = Host.mountID++;
    this._updateCount = 0;

    let Component = this._currentElement.type;
    let publicProps = this._currentElement.props;
    let isComponentClass = Component.prototype && Component.prototype.isComponentClass;
    // Class stateless component without state but have lifecycles
    let isStatelessClasss = Component.prototype.render;

    // Context process
    let publicContext = this._processContext(context);

    // Initialize the public class
    let instance;
    let renderedElement;

    if (isComponentClass || isStatelessClasss) {
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

    performInSandbox(() => {
      if (instance.componentWillMount) {
        instance.componentWillMount();
      }
    });

    if (renderedElement == null) {
      Host.component = this;
      // Process pending state when call setState in componentWillMount
      instance.state = this._processPendingState(publicProps, publicContext);

      // FIXME: handleError should named as lifecycles
      let handleError;
      if (typeof instance.handleError === 'function') {
        handleError = (e) => {
          instance.handleError(e);
        };
      }

      performInSandbox(() => {
        renderedElement = instance.render();
      }, handleError);

      Host.component = null;
    }

    this._renderedComponent = instantiateComponent(renderedElement);
    this._renderedComponent.mountComponent(
      this._parent,
      this._processChildContext(context),
      childMounter
    );

    if (this._currentElement && this._currentElement.ref) {
      Ref.attach(this._currentElement._owner, this._currentElement.ref, this);
    }

    performInSandbox(() => {
      if (instance.componentDidMount) {
        instance.componentDidMount();
      }
    });

    Hook.Reconciler.mountComponent(this);

    return instance;
  }

  unmountComponent(shouldNotRemoveChild) {
    let instance = this._instance;

    performInSandbox(() => {
      if (instance.componentWillUnmount) {
        instance.componentWillUnmount();
      }
    });

    Hook.Reconciler.unmountComponent(this);

    instance._internal = null;

    if (this._renderedComponent != null) {
      let ref = this._currentElement.ref;
      if (ref) {
        Ref.detach(this._currentElement._owner, ref, this);
      }

      this._renderedComponent.unmountComponent(shouldNotRemoveChild);
      this._renderedComponent = null;
      this._instance = null;
    }

    this._currentElement = null;

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

    if (willReceive && instance.componentWillReceiveProps) {
      // Calling this.setState() within componentWillReceiveProps will not trigger an additional render.
      this._pendingState = true;
      performInSandbox(() => {
        instance.componentWillReceiveProps(nextProps, nextContext);
      });
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
        });
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
      });

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
      });

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

    Hook.Reconciler.receiveComponent(this);
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
      nextRenderedElement = instance.render();
    });

    Host.component = null;

    if (shouldUpdateComponent(prevRenderedElement, nextRenderedElement)) {
      prevRenderedComponent.updateComponent(
        prevRenderedElement,
        nextRenderedElement,
        prevRenderedComponent._context,
        this._processChildContext(context)
      );
    } else {
      let oldChild = prevRenderedComponent.getNativeNode();
      prevRenderedComponent.unmountComponent(true);

      this._renderedComponent = instantiateComponent(nextRenderedElement);
      this._renderedComponent.mountComponent(
        this._parent,
        this._processChildContext(context),
        (newChild, parent) => {
          Host.driver.replaceChild(newChild, oldChild, parent);
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
