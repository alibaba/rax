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

  off(handler) {
    this.handlers = this.handlers.filter(h => h !== handler);
  }

  emit() {
    this.handlers.forEach(handler => handler(this.value));
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
        this.emitter.value = nextProps.value;
      }
    }

    componentDidUpdate(prevProps) {
      if (this.props.value !== prevProps.value) {
        this.emitter.emit();
      }
    }

    render() {
      return this.props.children;
    }
  }

  class Consumer extends Component {
    state = {
      value: this.readContext(this.context)
    }

    static contextTypes = {
      [contextProp]: PropTypes.object
    };

    onUpdate = value => this.state.value !== value && this.setState({value});

    readContext(context) {
      return context[contextProp] ? context[contextProp].value : defaultValue;
    }

    componentDidMount() {
      if (this.context[contextProp]) {
        this.context[contextProp].on(this.onUpdate);
      }
    }

    componentWillReceiveProps(nextProps, nextContext) {
      const newContextValue = this.readContext(nextContext);
      if (this.state.value !== newContextValue) {
        this.setState({
          value: newContextValue
        });
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
