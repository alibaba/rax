import Component from '../component';

let rootCounter = 1;

class Root extends Component {
  state = {
    // Using fragment instead of null
    // prevents the generation of a comment node
    element: []
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
