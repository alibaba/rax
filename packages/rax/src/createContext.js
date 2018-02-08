import Component from './component';
import PropTypes from './proptypes';

class ValueEmitter {
  constructor(defaultValue) {
    this.handlers = [];
    this.value = defaultValue;
  }

  on(handler) {
    this.handlers.push(handler);
  }

  off() {
    handlers = this.handlers.filter(h => h !== handler);
  }

  emit(value) {
    this.value = value;
    this.handlers.forEach(handler => handler(value));
  }
}

let uniqueId = 0;

export default function createContext(defaultValue) {

  const contextProp = '__context_' + uniqueId++ + '__';

  class Provider extends Component {
    emitter = new ValueEmitter(defaultValue);

    static childContextTypes = {
      [contextProp]: PropTypes.object
    };

    getChildContext() {
      return {
        [contextProp]: this.emitter
      };
    }

    componentWillMount() {
      if (this.props.value !== undefined) {
        this.emitter.value = this.props.value;
      }
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.value !== nextProps.value) {
        this.emitter.emit(nextProps.value);
      }
    }

    render() {
      return this.props.children;
    }
  }

  class Consumer extends Component {
    state = {
      value: this.context[contextProp] ? this.context[contextProp].value : defaultValue
    }

    static contextTypes = {
      [contextProp]: PropTypes.object
    };

    onUpdate = value => this.setState({value});

    componentDidMount() {
      if (this.context[contextProp]) {
        this.context[contextProp].on(this.onUpdate);
      }
    }

    componentWillUnmount() {
      if (this.context[contextProp]) {
        this.context[contextProp].off(this.onUpdate);
      }
    }

    render() {
      let children = this.props.children;
      let consumer = Array.isArray(children) ? children[0] : children;
      if (typeof consumer === 'function') {
        return consumer(this.state.value);
      }
    }
  }

  return {
    Provider,
    Consumer,
  };
}
