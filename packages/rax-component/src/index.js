/**
 * Base component class.
 */
class Component {
  constructor(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = {};
    this.updater = updater;
  }

  isComponentClass() {}

  setState(partialState, callback) {
    this.updater.setState(this, partialState, callback);
  }

  forceUpdate(callback) {
    this.updater.forceUpdate(this, callback);
  }
}

export default Component;
