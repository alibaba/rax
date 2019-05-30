/**
 * Base Component class definition.
 */
import Host from './host';

const _isClassComponent = true;
export default class Component {
  constructor(state, props, type) {
    this.state = {};
    this.props = {};
    this.componentType = type;
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
  getIsComponentClass() {
    return _isClassComponent;
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
