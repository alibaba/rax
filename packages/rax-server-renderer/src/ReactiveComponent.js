/**
 * Functional Reactive Component Class Wrapper
 */
class ReactiveComponent {
  constructor(pureRender) {
    // A pure function
    this._render = pureRender;
    this._hookID = 0;
    this._hooks = {};
    // Handles store
    this.didMount = [];
    this.didUpdate = [];
    this.willUnmount = [];
  }

  getHooks() {
    return this._hooks;
  }

  getHookID() {
    return ++this._hookID;
  }

  render() {
    this._hookID = 0;

    let children = this._render(this.props, this.context);

    return children;
  }
}

export default ReactiveComponent;