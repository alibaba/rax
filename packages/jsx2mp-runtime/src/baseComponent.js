/**
 * base component of mini-app, all rax compoent will extends it
 */
class MiniComponent {
  constructor(state, props, type) {
    this.state = {};
    this.props = {};
    this.componentType = type;
    this.callbacksQueue = [];
    this.miniRoute = {
      params: {},
      path: ''
    };
    this.hooks = [];
  }
  scopeInit(scope) {
    this.scope = scope;
  }
  setState(state, callback) {
    // TODO: add shouldComponentUpdate before setData
    this.scope.setData(state, callback);
  }
  forceUpdate(callback) {
    if (typeof callback === 'function') {
      this.callbacksQueue.push(callback);
    }
    this.scope.setData(this.state, callback);
  }
}

export { MiniComponent };
