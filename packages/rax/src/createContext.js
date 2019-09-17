import invokeFunctionsWithContext from './invokeFunctionsWithContext';
import { useState, useEffect } from './hooks';
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
  const contextProp = '__ctx' + uniqueId++;
  const stack = [];
  const defaultEmitter = new ValueEmitter(defaultValue);

  function Provider(props) {
    const propsValue = props.value !== undefined ? props.value : defaultValue;
    const [value, setValue] = useState(propsValue);
    const [emitter] = useState(() => new ValueEmitter(value));
    emitter.value = propsValue;

    if (propsValue !== value) setValue(propsValue);

    useEffect(() => {
      stack.pop();
    });

    useEffect(() => {
      emitter.emit();
    }, [value]);

    stack.push(emitter);
    return props.children;
  }

  function readEmitter(instance) {
    const emitter = stack[stack.length - 1];
    if (emitter) return emitter;
    while (instance && instance[INTERNAL]) {
      if (instance instanceof Provider) {
        break;
      }
      instance = instance[INTERNAL].__parentInstance;
    }
    return instance && instance.emitter || defaultEmitter;
  }

  Provider.readEmitter = readEmitter;
  Provider.contextProp = contextProp;

  function Consumer(props) {
    const [emitter] = useState(() => readEmitter(this));
    const [value, setValue] = useState(emitter.value);

    if (value !== emitter.value) {
      setValue(emitter.value);
      return; // Interrupt execution of consumer.
    }

    function onUpdate(updatedValue) {
      if (value !== updatedValue) {
        setValue(updatedValue);
      }
    }

    useEffect(() => {
      emitter.on(onUpdate);
      return () => {
        emitter.off(onUpdate);
      };
    }, []);

    const children = props.children;
    const consumer = toArray(children)[0];
    if (isFunction(consumer)) {
      return consumer(value);
    }
  }

  return {
    Provider,
    Consumer,
  };
}
