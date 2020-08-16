import Emitter from './valueEmitter';

let uniqueId = 0;

export default function createContext(defaultValue) {
  const contextProp = '__ctx' + uniqueId++;
  let globalEmitter;
  const defaultEmitter = new Emitter(defaultValue);

  function Provider(passedVal = defaultValue) {
    const emitter = globalEmitter;
    if (!emitter) {
      globalEmitter = new Emitter(passedVal);
    } else {
      emitter.value = passedVal;
      emitter.emit();
    }
  }

  function readEmitter() {
    return globalEmitter || defaultEmitter;
  }

  Provider.readEmitter = readEmitter;
  Provider.contextProp = contextProp;

  return {
    Provider
  };
}
