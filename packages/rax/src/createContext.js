import invokeFunctionsWithContext from './invokeFunctionsWithContext';
import { useState, useEffect, getCurrentInstance } from './hooks';
import { isFunction } from './types';
import { INTERNAL } from './constant';
import toArray from './toArray';

class ValueEmitter {
  constructor(defaultValue) {
    this.__handlers = [];
    this.value = defaultValue;
  }

  on(handler) {
    this.__handlers.push(handler);
  }

  off(handler) {
    this.__handlers = this.__handlers.filter(h => h !== handler);
  }

  emit() {
    invokeFunctionsWithContext(this.__handlers, null, this.value);
  }
}

let uniqueId = 0;

export default function createContext(defaultValue) {
  const contextProp = uniqueId++;
  const defaultEmitter = new ValueEmitter(defaultValue);

  // Provider Component
  function Provider(props) {
    // Use a Provider to pass the value or default value to the tree below,
    // Any component can read it, no matter how deep it is.
    const propsValue = props.value !== undefined ? props.value : defaultValue;
    const [value, setValue] = useState(propsValue);

    const [emitter] = useState(() => {
      const emitter = new ValueEmitter();
      // Inject emitter to current instance
      const instance = getCurrentInstance();
      return instance.__emitter = emitter;
    });
    emitter.value = propsValue;

    if (propsValue !== value) setValue(propsValue);

    useEffect(() => {
      emitter.emit();
    }, [value]);

    return props.children;
  }

  function readEmitter(instance) {
    // Find Provider parent over parent
    while (instance && instance[INTERNAL]) {
      // Provoide feature detection
      if (instance.__emitter) {
        return instance.__emitter;
      }
      instance = instance[INTERNAL].__parentInstance;
    }
    // Use defaultValue emitter when not have Provider over parent
    return defaultEmitter;
  }

  Provider.readEmitter = readEmitter;
  Provider.__contextProp = contextProp;

  // Cuonsumer Component
  function Consumer(props) {
    const [emitter] = useState(() => readEmitter(this));
    const [value, setValue] = useState(emitter.value);

    if (value !== emitter.value) {
      setValue(emitter.value);
      return; // Interrupt execution of consumer.
    }

    useEffect(() => {
      function onUpdate(updatedValue) {
        if (value !== updatedValue) {
          setValue(updatedValue);
        }
      }

      emitter.on(onUpdate);
      return () => {
        emitter.off(onUpdate);
      };
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
  };
}
