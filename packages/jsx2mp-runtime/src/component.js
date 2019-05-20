import Host from './host';

const INSTANCE = '__rax_instance__';
const CYCLE_MAP = {
  componentDidMount: 'didMount',
  componentWillReceiveProps: 'didUpdate',
  componentWillUnmount: 'didUnmount',
};

function hasOwn(object, prop) {
  return Object.hasOwnProperty.call(object, prop);
}

let componentCount = 0;
class Component {
  constructor(type, declearType) {
    this.componentId = ++componentCount;
    this.type = type;
    this.declearType = declearType;

    this.methods = {}; // Public for miniapp component interface.
    this._methods = {}; // Privite and real handlers.
    this._hookID = 0;
    this._hooks = {};
    this._lifecycle = {};
    this._state = {};
    const self = this;
    // Get reference of miniapp component instance.
    this.onInit = function() {
      self._internal = this;
      if (declearType === 'class') {
        self._render();
      }
    };

    if (declearType === 'class') {
      const { prototype: klassPrototype, mixins, defaultProps } = type;
      if (mixins) this.mixins = mixins;
      if (defaultProps) this.props = defaultProps;
      this.data = () => {
        const instance = new type({}, null); // eslint-disable-line
        this[INSTANCE] = instance;
        return this._state = instance.state;
      };
      /**
       * Bind function class methods into methods or cycles.
       */
      const classMethods = Object.getOwnPropertyNames(klassPrototype);
      for (let i = 0, l = classMethods.length; i < l; i++) {
        const methodName = classMethods[i];
        if ('constructor' === methodName) continue;

        if (typeof klassPrototype[methodName] === 'function') {
          const fn = klassPrototype[methodName];
          if (hasOwn(CYCLE_MAP, methodName)) {
            this._registerLifeCycle(CYCLE_MAP[methodName], fn); // lifecycle
          } else {
            this.methods[methodName] = this._createEventDelegate(methodName);
            this._methods[methodName] = fn; // event handlers
          }
        }
      }
    } else if (declearType === 'function') {
      this.data = () => this._state;
      this._render();
    }
  }


  /**
   * @Note: Why need a delegate to operate with events.
   *    Ali miniapp can not dynamicly modify the methods object to get a new event handler.
   *    Use a delegate to reuse and fix the `this` reference.
   * @param handlerName {String} Handler identifier name of function.
   * @return {Function} Event handler function.
   * @private
   */
  _createEventDelegate(handlerName) {
    const componentInstance = this;
    return function(event) {
      if (typeof componentInstance._methods[handlerName] === 'function') {
        componentInstance._methods[handlerName].call(componentInstance, event);
      }
    };
  }

  _render() {
    Host.current = this;
    this._hookID = 0;

    if (this.declearType === 'function') {
      this._methods = this.type() || {};
      Object.keys(this._methods).forEach((key) => {
        if (!this.methods[key]) {
          this.methods[key] = this._createEventDelegate(key);
        }
      });
    } else if (this.declearType === 'class') {
      Object.assign(this._methods, this[INSTANCE].render());
    }

    Host.current = null;
  }

  getHooks() {
    return this._hooks;
  }

  getHookID() {
    return ++this._hookID;
  }

  /**
   * Bridge setState directly to setData. `this` is bound to component instance.
   * @param particialState {Object|Function}
   * @param callback? {Function}
   */
  setState(particialState, callback) {
    return this._internal.setData(particialState, callback);
  }

  /**
   * Bridge to forceUpdate.
   * @param callback? {Function}
   */
  forceUpdate(callback) {
    return this.setState.call(this, {}, callback);
  }

  didMount = () => {
    this._invokeLifeCycle('didMount');
  };

  didUpdate = (prevProps, prevData) => {
    this._invokeLifeCycle('didUpdate', prevProps, prevData);
  };

  didUnmount = () => {
    this._invokeLifeCycle('willUnmount');
  };

  _update(patialState) {
    Host.isUpdating = true;

    this.setState(
      Object.assign(this._state, patialState),
      () => {
        Host.isUpdating = false;
        this._render();
      }
    );
  }

  _registerLifeCycle(cycle, callback) {
    const cycles = this._lifecycle[cycle] = this._lifecycle[cycle] || [];
    cycles.push(callback);
  }

  _invokeLifeCycle(cycle, ...args) {
    const cycles = this._lifecycle[cycle];
    if (Array.isArray(cycles)) {
      cycles.forEach((callback) => callback.apply(this, args));
    }
  }
}

/**
 * Bridge from RaxComponent Klass to MiniApp Component constructor.
 * @param exported {RaxComponent}
 * @param type {String} function or class component type.
 * @return {Object} MiniApp Component constructor's first arg.
 */
export function createComponent(exported, type = 'class') {
  return new Component(exported, type);
}
