/**
 * Base Component class definition.
 */
import Host from './host';
import { setComponentInstance, updateChildProps } from './updater';
import {
  RENDER,
  ON_SHOW,
  ON_HIDE,
  COMPONENT_DID_MOUNT,
  COMPONENT_DID_UPDATE,
  COMPONENT_WILL_MOUNT,
  COMPONENT_WILL_UNMOUNT,
  COMPONENT_WILL_RECEIVE_PROPS,
} from './cycles';
import { enqueueRender } from './enqueueRender';

export default class Component {
  constructor() {
    this.state = {};
    this.props = {};

    this.shouldUpdate = false;
    this._methods = {};
    this._hooks = {};
    this.hooks = []; // ??
    this._hookID = 0;
  }

  setState(partialState, callback) {
    this._internal.setData(partialState, () => {
      Object.assign(this.state, partialState); // Lazily assign to state.
      this._trigger(RENDER); // Trigger rerender.
      callback && callback();
    });
  }

  forceUpdate(callback) {
    this.setState({}, callback);
  }

  getHooks() {
    return this._hooks;
  }

  getHookID() {
    return ++this._hookID;
  }

  _cycles = {};

  /**
   * Register a lifecycle function.
   */
  _registerLifeCycle(cycle, fn) {
    const currentCycles = this._cycles[cycle] = this._cycles[cycle] || [];
    currentCycles.push(fn);
  }

  /**
   * Used in render cycle
   * @private
   */
  _updateData(data) {
    data.$ready = true;
    this.__updating = true;
    this._internal.setData(data, () => {
      this.__updating = false;
    });
  }

  _updateMethods(methods) {
    Object.assign(this._methods, methods);
  }

  _updateChildProps() {}

  // Todo
  _mountComponent() {}
  _updateComponent() {}
  _unmountComponent() {}

  /**
   * Trigger lifecycle with args.
   * @param cycle {String} Name of lifecycle.
   * @param args
   * @private
   */
  _trigger(cycle, ...args) {
    switch (cycle) {
      case COMPONENT_WILL_MOUNT:
      case COMPONENT_DID_MOUNT:
      case COMPONENT_WILL_RECEIVE_PROPS:
      case COMPONENT_DID_UPDATE:
      case COMPONENT_WILL_UNMOUNT:
      case ON_SHOW:
      case ON_HIDE:
        if (isFunction(this[cycle])) this[cycle](...args);
        if (this._cycles.hasOwnProperty(cycle)) {
          let fn;
          while (fn = this._cycles[cycle].pop()) { // eslint-disable-line
            fn(...args);
          }
        }
        break;

      case RENDER:
        if (this.__updating) return;
        if (typeof this.render !== 'function') throw new Error('It seems have no render method.');
        Host.current = this;
        this._hookID = 0;
        const nextProps = args[0] || this._internal.props;
        const nextState = args[1] || this._internal.data;

        if (nextProps.hasOwnProperty('__pid')) {
          setComponentInstance(nextProps.__pid, this);
        }

        this.render(this.props = nextProps, this.state = nextState);
        break;
    }
  }

  /**
   * Internal means page/component instance of miniapp.
   * @param internal
   * @private
   */
  _setInternal(internal) {
    this._internal = internal;
    this.props = internal.props;
    if (!this.state) this.state = {};
    Object.assign(this.state, internal.data);
  }
}

function devideUpdated(updated) {
  const functions = {};
  const data = {};
  Object.keys(updated).forEach(key => {
    if (isFunction(updated[key])) {
      functions[key] = updated[key];
    } else {
      data[key] = updated[key];
    }
  });
  return { functions, data };
}

function isFunction(fn) {
  return typeof fn === 'function';
}
