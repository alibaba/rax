/**
 * Base Component class definition.
 */
import Host from './host';
import { on, emit } from './eventEmitter';
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
import {enqueueRender} from "./enqueueRender";

export default class Component {
  constructor() {
    this.state = {};
    this.props = {};

    this.shouldUpdate = false;
    this._methods = {};
    this._hooks = {};
    this.hooks = []; // ??
    this._hookID = 0;
    on(RENDER, () => this._dirtyCheck());
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
        if (this.__updating) return;
        if (typeof this.render !== 'function') throw new Error('It seems have no render method.');
        this.__updating = true;
        Host.current = this;
        this._hookID = 0;
        const nextProps = args[0] || this._internal.props;
        const nextState = args[1] || this._internal.data;
        const updated = this.render(this.props = nextProps, this.state = nextState);
        const { functions, data } = devideUpdated(updated);
        Object.assign(this._methods, functions);
        this._internal.setData(data, () => {
          this.__updating = false;
          emit(RENDER);
        });
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

  _dirtyCheck() {
    if (this.__updating) return;
    this._dirty = false;
    for (let key in this._internal.props) {
      if (this._internal.props.hasOwnProperty(key) && this._internal.props[key] !== this.props[key]) {
        this._dirty = true;
        break;
      }
    }
    if (this._dirty) enqueueRender(this);
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
