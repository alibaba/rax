import Component from '../component';

let rootCounter = 1;

class Root extends Component {
  state = {
    element: this.props.children
  };
  rootID = rootCounter++;
  getPublicInstance() {
    return this.getRenderedComponent().getPublicInstance();
  }
  getRenderedComponent() {
    return this._internal._renderedComponent;
  }
  update(element) {
    this.setState({
      element
    });
  }
  render() {
    return this.state.element;
  }
}

export default Root;
