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
    // The updater property is injected when composite component mounting
    this.updater.setState(this, partialState, callback);
  }

  forceUpdate(callback) {
    this.updater.forceUpdate(this, callback);
  }
}

/**
 * Pure component class.
 */
export class PureComponent extends Component {
  constructor(props, context) {
    super(props, context);
    this.isPureComponent = true;
  }
}

export default Component;
