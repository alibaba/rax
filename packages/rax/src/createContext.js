import invokeFunctionsWithContext from './invokeFunctionsWithContext';
import { useState, useLayoutEffect } from './hooks';
import { isFunction } from './types';
import toArray from './toArray';
import { INTERNAL } from './constant';

let id = 0;

export default function createContext(defaultValue) {
  const contextID = '_c' + id++;

  // Provider Component
  class Provider {
    constructor() {
      this.__contextID = contextID;
      this.__handlers = [];
    }
    __on(handler) {
      this.__handlers.push(handler);
    }
    __off(handler) {
      this.__handlers = this.__handlers.filter(h => h !== handler);
    }
    // Like getChildContext but called in SSR
    _getChildContext() {
      return {
        [contextID]: this
      };
    }
    getValue() {
      return this.props.value !== undefined ? this.props.value : defaultValue;
    }
    componentDidUpdate() {
      invokeFunctionsWithContext(this.__handlers, null, this.getValue());
    }
    render() {
      return this.props.children;
    }
  }

  function getNearestProvider(instance) {
    let provider;
    while (instance && instance[INTERNAL]) {
      if (instance.__contextID === contextID) {
        provider = instance;
        break;
      }
      instance = instance[INTERNAL].__parentInstance;
    }
    return provider;
  }

  // Cuonsumer Component
  function Consumer(props, context) {
    // Current `context[contextID]` only works in SSR
    const provider = context[contextID] || getNearestProvider(this);
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

  return {
    Provider,
    Consumer,
    _contextID: contextID, // Export for SSR
    _defaultValue: defaultValue,
    __getNearestProvider: getNearestProvider,
  };
}
