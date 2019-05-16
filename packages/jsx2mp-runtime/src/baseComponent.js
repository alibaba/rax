/**
 * base component of mini-app, all rax compoent will extends it
 */
class MiniComponent {
  constructor(props = {}) {
    this.state = {};
    this.props = props;
    this._mini_route = {
      params: {},
      path: ""
    };
  }
  setState(state, callback) {}
  forceUpdate(callback) {}
}

export { MiniComponent };
