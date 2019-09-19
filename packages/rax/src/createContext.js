import invokeFunctionsWithContext from './invokeFunctionsWithContext';
import { useState, useLayoutEffect } from './hooks';
import { isFunction } from './types';
import toArray from './toArray';
import ReactiveComponent from './vdom/reactive';

let contextID = 0;

export default function createContext(defaultValue) {
  const contextName = '_c' + contextID++;

  // Provider Component
  class Provider {
    constructor() {
      this.__handlers = [];
    }
    __on(handler) {
      this.__handlers.push(handler);
    }
    __off(handler) {
      this.__handlers = this.__handlers.filter(h => h !== handler);
    }
    getValue() {
      return this.props.value !== undefined ? this.props.value : defaultValue;
    }
    getChildContext() {
      return {
        [contextName]: this
      };
    }
    shouldComponentUpdate(nextProps) {
      return this.props.value !== nextProps.value;
    }
    componentDidUpdate() {
      invokeFunctionsWithContext(this.__handlers, null, this.getValue());
    }
    render() {
      return this.props.children;
    }
  }

  // Cuonsumer Component
  function Consumer(props, context) {
    const provider = context[contextName];
    let value = provider && provider.getValue() || defaultValue;
    const [prevValue, setValue] = useState(() => value);

    if (value !== prevValue) {
      setValue(value);
      return; // Interrupt execution of consumer.
    }

    useLayoutEffect(() => {
      if (provider) {
        function onUpdate(updatedValue) {
          if (value !== updatedValue) {
            setValue(updatedValue);
          }
        }

        provider.__on(onUpdate);
        return () => {
          provider.__off(onUpdate);
        };
      }
    }, [provider]);
    // Consumer requires a function as a child.
    // The function receives the current context value.
    const consumer = toArray(props.children)[0];
    if (isFunction(consumer)) {
      return consumer(value);
    }
  }

  Consumer.contextTypes = {
    [contextName]: null
  };

  return {
    Provider,
    Consumer,
    _contextName: contextName,
    _defaultValue: defaultValue,
  };
}
