/* global PROPS */
/**
 * Base Component class definition.
 */
import { getId, updateData, registerRef } from './adapter/index';
import Host from './host';
import {updateChildProps, removeComponentProps, getComponentProps, setComponentProps} from './updater';
import {enqueueRender} from './enqueueRender';
import isFunction from './isFunction';
import sameValue from './sameValue';
import {
  RENDER,
  ON_SHOW,
  ON_HIDE,
  ON_PAGE_SCROLL,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_SHARE_APP_MESSAGE,
  ON_TAB_ITEM_TAP,
  ON_TITLE_CLICK,
  ON_BACK_PRESS,
  ON_MENU_PRESS,
  COMPONENT_DID_MOUNT,
  COMPONENT_DID_UPDATE,
  COMPONENT_WILL_MOUNT,
  COMPONENT_WILL_UNMOUNT,
  COMPONENT_WILL_RECEIVE_PROPS, COMPONENT_WILL_UPDATE,
} from './cycles';
import { cycles as pageCycles } from './page';

export default class Component {
  constructor(props) {
    this.state = {};
    this.props = props;

    this.__dependencies = {}; // for context

    this.__mounted = false;
    this.__shouldUpdate = false;
    this._methods = {};
    this._hooks = {};
    this.hooks = []; // ??
    this._hookID = 0;

    this._pendingStates = [];
    this._pendingCallbacks = [];
  }

  // Bind to this instance.
  setState = (partialState, callback) => {
    if (partialState != null) {
      this._pendingStates.push(partialState);
    }

    if (isFunction(callback)) {
      this._pendingCallbacks.push(callback);
    }

    enqueueRender(this);
  };

  forceUpdate = (callback) => {
    if (isFunction(callback)) {
      this._pendingCallbacks.push(callback);
    }
    this._updateComponent();
  };

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
    if (!this._internal) return;
    data.$ready = true;
    data[TAGID] = this.props[TAGID];
    this.__updating = true;
    this._setData(data);
  }

  _updateMethods(methods) {
    Object.assign(this._methods, methods);
  }

  _updateChildProps(tagId, props) {
    const chlidInstanceId = `${this.props[TAGID]}-${tagId}`;
    updateChildProps(this, chlidInstanceId, props);
  }

  _registerRefs(refs) {
    this.refs = {};
    refs.forEach(({name, method}) => {
      registerRef.call(this, name, method);
    });
  }

  _collectState() {
    const state = Object.assign({}, this.state);
    let parialState;
    while (parialState = this._pendingStates.shift()) { // eslint-disable-line
      if (parialState == null) continue; // eslint-disable-line
      if (isFunction(parialState)) {
        Object.assign(state, parialState.call(this, state, this.props));
      } else {
        Object.assign(state, parialState);
      }
    }
    return state;
  }

  _readContext(context) {
    const Provider = context.Provider;
    const contextProp = Provider.contextProp;
    let contextItem = this.__dependencies[contextProp];
    if (!contextItem) {
      const readEmitter = Provider.readEmitter;
      const contextEmitter = readEmitter();
      contextItem = {
        emitter: contextEmitter,
        renderedContext: contextEmitter.value,
      };

      const contextUpdater = (newContext) => {
        if (!sameValue(newContext, contextItem.renderedContext)) {
          this.__shouldUpdate = true;
          this._updateComponent();
        }
      };

      contextItem.emitter.on(contextUpdater);
      this._registerLifeCycle(COMPONENT_WILL_UNMOUNT, () => {
        contextItem.emitter.off(contextUpdater);
      });
      this.__dependencies[contextProp] = contextItem;
    }
    return contextItem.renderedContext = contextItem.emitter.value;
  }

  _injectContextType() {
    const contextType = this.constructor.contextType;
    if (contextType) {
      this.context = this._readContext(contextType);
    }
  }

  _mountComponent() {
    // Step 1: get state from getDerivedStateFromProps,
    // __getDerivedStateFromProps is a reference to constructor.getDerivedStateFromProps
    if (this.__getDerivedStateFromProps) {
      const getDerivedStateFromProps = this.__getDerivedStateFromProps;
      const partialState = getDerivedStateFromProps(this.props, this.state);
      if (partialState) this.state = Object.assign({}, partialState);
    }

    // Step 2: trigger will mount.
    this._trigger(COMPONENT_WILL_MOUNT);

    // Step3: trigger render.
    this._trigger(RENDER);

    // Step4: mark __mounted = true
    if (!this.__mounted) {
      this.__mounted = true;
    }
    // Step5: create prevProps and prevState reference
    this.prevProps = this.props;
    this.prevState = this.state;
  }

  _updateComponent() {
    if (!this.__mounted) return;
    // Step1: propTypes check, now skipped.
    // Step2: make props to prevProps, and trigger willReceiveProps
    const nextProps = this.nextProps || this.props; // actually this is nextProps
    const prevProps = this.props = this.prevProps || this.props;

    if (diffProps(prevProps, nextProps)) {
      this._trigger(COMPONENT_WILL_RECEIVE_PROPS, nextProps);
    }

    // Step3: collect pending state
    let nextState = this._collectState();
    const prevState = this.prevState || this.state;

    // Step4: update state if defined getDerivedStateFromProps
    let stateFromProps;
    if (this.__getDerivedStateFromProps) {
      const getDerivedStateFromProps = this.__getDerivedStateFromProps;
      const partialState = getDerivedStateFromProps(nextProps, nextState);
      if (partialState) stateFromProps = Object.assign({}, partialState);
    }
    // if null, means not to update state.
    if (stateFromProps !== undefined) nextState = stateFromProps;

    // Step5: judge shouldComponentUpdate
    this.__shouldUpdate = this.__forceUpdate
      || this.shouldComponentUpdate ? this.shouldComponentUpdate(nextProps, nextState) : true;

    // Step8: trigger render
    if (this.__shouldUpdate) {
      this._trigger(COMPONENT_WILL_UPDATE, nextProps, nextState);
      // Update propsMap
      setComponentProps(this.instanceId);
      this.props = nextProps;
      this.state = nextState;
      this.__forceUpdate = false;
      this._trigger(RENDER);
      this._trigger(COMPONENT_DID_UPDATE, prevProps, prevState);
    }

    this.prevProps = this.props;
    this.prevState = this.state;
  }

  _unmountComponent() {
    this._trigger(COMPONENT_WILL_UNMOUNT);
    // Clean up hooks
    this.hooks.forEach(hook => {
      if (isFunction(hook.destory)) hook.destory();
    });
    this._internal.instance = null;
    this._internal = null;
    this.__mounted = false;
    removeComponentProps(this.instanceId);
  }

  /**
   * Trigger lifecycle with args.
   * @param cycle {String} Name of lifecycle.
   * @param args
   * @private
   */
  _trigger(cycle, ...args) {
    let ret;
    const pageId = this.instanceId;

    switch (cycle) {
      case COMPONENT_WILL_MOUNT:
      case COMPONENT_DID_MOUNT:
      case COMPONENT_WILL_RECEIVE_PROPS:
      case COMPONENT_WILL_UPDATE:
      case COMPONENT_DID_UPDATE:
      case COMPONENT_WILL_UNMOUNT:
      case ON_SHOW:
      case ON_HIDE:
      case ON_PAGE_SCROLL:
      case ON_REACH_BOTTOM:
      case ON_TAB_ITEM_TAP:
      case ON_TITLE_CLICK:
      case ON_PULL_DOWN_REFRESH:
      case ON_BACK_PRESS:
      case ON_MENU_PRESS:
        if (isFunction(this[cycle])) this[cycle](...args);
        if (this._cycles.hasOwnProperty(cycle)) {
          this._cycles[cycle].forEach(fn => fn(...args));
        }
        if (pageCycles[pageId] && pageCycles[pageId][cycle]) {
          pageCycles[pageId][cycle].forEach(fn => fn(...args));
        }
        break;

      case RENDER:
        if (!isFunction(this.render)) throw new Error('It seems component have no render method.');
        Host.current = this;
        this._hookID = 0;
        const nextProps = args[0] || this.props;
        const nextState = args[1] || this.state;

        this._injectContextType();

        this.render(this.props = nextProps, this.state = nextState);
        break;

      case ON_SHARE_APP_MESSAGE:
        if (isFunction(this[cycle])) ret = this[cycle](...args);
        if (pageCycles[pageId] && pageCycles[pageId][cycle]) {
          // There will be one callback fn for shareAppMessage at most
          const fn = pageCycles[pageId][cycle][0];
          ret = fn(...args);
        }
        break;
    }
    return ret;
  }

  /**
   * Internal means page/component instance of miniapp.
   * @param internal
   * @private
   */
  _setInternal(internal) {
    this._internal = internal;
    const parentId = getId('parent', internal);
    const tagId = getId('tag', internal);
    this.instanceId = `${parentId}-${tagId}`;
    this.props = Object.assign({}, internal[PROPS], {
      TAGID: tagId,
      PARENTID: parentId
    }, getComponentProps(this.instanceId));
    if (!this.state) this.state = {};
    Object.assign(this.state, internal[DATA]);
  }
  /**
   * Internal set data method
   * @param data {Object}
   * */
  _setData(data) {
    updateData.call(this, data);
    Object.assign(this.state, data);
  }
}

function diffProps(prev, next) {
  for (let key in next) {
    if (next[key] !== prev[key]) return true;
  }
  return false;
}
