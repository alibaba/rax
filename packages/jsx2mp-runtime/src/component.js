/**
 * Base Component class definition.
 */
import Host from './host';
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
        break;

      case RENDER:
        if (typeof this.render !== 'function') throw new Error('It seems have no render method.');
        const updated = this.render(this.props);
        const { functions, data } = devideUpdated(updated);
        Object.assign(this._methods, functions);
        this._internal.setData(data);
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
    this.props.__proto__ = internal.props;
    this.state.__proto__ = internal.data;
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
