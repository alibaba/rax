import Component from './vdom/component';
import { isFunction, isArray } from './is';

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
  const stack = [];
  const defaultEmitter = new ValueEmitter(defaultValue);

  class Provider extends Component {
    constructor(props) {
      super(props);
      const value = this.props.value !== undefined ? this.props.value : defaultValue;
      this.emitter = new ValueEmitter(value);
    }

    componentDidMount() {
      stack.pop();
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.value !== nextProps.value) {
        this.emitter.value = nextProps.value !== undefined ? nextProps.value : defaultValue;
      }
    }

    componentDidUpdate(prevProps) {
      stack.pop();
      if (this.props.value !== prevProps.value) {
        this.emitter.emit();
      }
    }

    render() {
      stack.push(this.emitter);
      return this.props.children;
    }
  }

  function readEmitter(instance) {
    const emitter = stack[stack.length - 1];
    if (emitter) return emitter;
    while (instance && instance._internal) {
      if (instance instanceof Provider) {
        break;
      }
      instance = instance._internal._parentInstance;
    }
    return instance && instance.emitter || defaultEmitter;
  }

  Provider.readEmitter = readEmitter;
  Provider.contextProp = contextProp;

  class Consumer extends Component {
    componentWillMount() {
      this.emitter = readEmitter(this);
      this.setState({
        value: this.emitter.value
      });
      this.onUpdate = value => this.state.value !== value && this.setState({value});
    }

    componentDidMount() {
      this.emitter.on(this.onUpdate);
    }

    componentWillReceiveProps() {
      if (this.state.value !== this.emitter.value) {
        this.setState({
          value: this.emitter.value
        });
      }
    }

    componentWillUnmount() {
      this.emitter.off(this.onUpdate);
    }

    render() {
      let children = this.props.children;
      let consumer = isArray(children) ? children[0] : children;
      if (isFunction(consumer)) {
        return consumer(this.state.value);
      }
    }
  }

  return {
    Provider,
    Consumer,
  };
}
