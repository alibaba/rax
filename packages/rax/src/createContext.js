import invokeFunctionsWithContext from './invokeFunctionsWithContext';
import { useState, useLayoutEffect } from './hooks';
import { isFunction } from './types';
import toArray from './toArray';
import getNearestParent from './vdom/getNearestParent';

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
    // `getValue()` called in rax-server-renderer
    getValue() {
      return this.props.value !== undefined ? this.props.value : defaultValue;
    }
    componentDidUpdate(prevProps) {
      if (this.props.value !== prevProps.value) {
        invokeFunctionsWithContext(this.__handlers, null, this.getValue());
      }
    }
    render() {
      return this.props.children;
    }
  }

  function getNearestParentProvider(instance) {
    return getNearestParent(instance, parent => parent.__contextID === contextID);
  }

  // Consumer Component
  function Consumer(props, context) {
    // Current `context[contextID]` only works in SSR
    const [provider] = useState(() => context[contextID] || getNearestParentProvider(this));
    let value = provider ? provider.getValue() : defaultValue;
    const [prevValue, setValue] = useState(value);

    if (value !== prevValue) {
      setValue(value);
      return; // Interrupt execution of consumer.
    }

    useLayoutEffect(() => {
      if (provider) {
        provider.__on(setValue);
        return () => {
          provider.__off(setValue);
        };
      }
    }, []);

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
    // `_contextID` and `_defaultValue` accessed in rax-server-renderer
    _contextID: contextID,
    _defaultValue: defaultValue,
    __getNearestParentProvider: getNearestParentProvider,
  };
}
