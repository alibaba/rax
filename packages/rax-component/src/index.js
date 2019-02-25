/**
 * Base component class.
 */
class Component {
  constructor(props, context) {
    this.props = props;
    this.context = context;
    this.refs = {};
  }

  setState(partialState, callback) {
    this.updater.setState(this, partialState, callback);
  }

  forceUpdate(callback) {
    this.updater.forceUpdate(this, callback);
  }
}

export default Component;
