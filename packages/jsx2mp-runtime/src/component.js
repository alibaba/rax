/**
 * Base Component class definition.
 */
import Host from './host';

export default class Component {
  constructor(ops) {
    const { state, props, functionClass } = ops;
    this.state = {};
    this.props = {};
    this.functionClass = functionClass;
    this.callbacksQueue = [];
    this.shouldUpdate = false;

    this._methods = {};
    this._state = {};
    this._hooks = {};
    this.hooks = [];
    this._hookID = 0;
    this._disable = true;
  }
  scopeInit(scope) {
    this.scope = scope;
    this._internal = scope;
  }
  setState(state, callback) {
    // TODO: add shouldComponentUpdate before setData
    this.scope.setData(state, callback);
  }
  getHooks() {
    return this._hooks;
  }
  getHookID() {
    return ++this._hookID;
  }
  _update(patialState) {
    Host.isUpdating = true;
    this.setState(Object.assign(this._state, patialState), () => {
      Host.isUpdating = false;
      Host.current = null;
      this._hookID = 0;
    });
  }
  forceUpdate(callback) {
    if (typeof callback === 'function') {
      this.callbacksQueue.push(callback);
    }
    this.scope.setData(this.state, callback);
  }
}
