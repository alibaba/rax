import Component from './component';

export default function createContext(defaultValue) {
  let currentValue = defaultValue;
  let updaters = [];

  class Provider extends Component {
    render() {
      const props = this.props;
      if (currentValue !== props.value) {
        currentValue = props.value;
        updaters.forEach(updater => updater());
      }
      return props.children;
    }
  }

  class Consumer extends Component {
    componentDidMount() {
      updaters.push(() => this.forceUpdate());
    }
    render() {
      let consumer = this.props.children;
      if (typeof consumer === 'function') {
        return consumer(currentValue);
      }
    }
  }

  return {
    Provider,
    Consumer,
  };
}
