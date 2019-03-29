import Component from './component';

let rootID = 1;

class Root extends Component {
  constructor() {
    super();
    // Using fragment instead of null for avoid create a comment node when init mount
    this.element = [];
    this.rootID = rootID++;
  }

  getPublicInstance() {
    return this.getRenderedComponent().getPublicInstance();
  }

  getRenderedComponent() {
    return this._internal._renderedComponent;
  }

  update(element) {
    this.element = element;
    this.forceUpdate();
  }

  render() {
    return this.element;
  }
}

export default Root;
