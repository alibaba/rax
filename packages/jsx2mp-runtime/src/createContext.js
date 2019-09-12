import { useState, useEffect } from './hooks';
import isFunction from './isFunction';
import Emitter from './eventEmitter';

let uniqueId = 0;

export default function createContext(defaultValue) {
  const contextProp = '__ctx' + uniqueId++;
  const stack = [];
  let globalEmitter;
  const defaultEmitter = new Emitter(defaultValue);

  function Provider(passedVal = defaultValue) {
    const [value, setValue] = useState(passedVal);
    const [emitter] = useState(() => new Emitter(value));
    emitter.value = passedVal;

    if (passedVal !== value) setValue(passedVal);

    useEffect(() => {
      stack.pop();
    });

    useEffect(() => {
      console.log('yes!', value);
      emitter.emit();
    }, [value]);

    stack.push(emitter);
    globalEmitter = emitter;
  }

  function readEmitter(instance) {
    const e = stack[stack.length - 1];
    if (e) return e;
    // while (instance && instance._internal) {
    //   if (instance instanceof Provider) {
    //     break;
    //   }
    //   instance = instance._internal._parentInstance;
    // }
    // return instance && instance.emitter || defaultEmitter;
    return globalEmitter || defaultEmitter;
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
    const consumer = Array.isArray(children) ? children[0] : children;
    if (isFunction(consumer)) {
      return consumer(value);
    }
  }

  return {
    Provider,
    Consumer,
  };
}
