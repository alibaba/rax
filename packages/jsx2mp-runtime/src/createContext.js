import Emitter from './eventEmitter';

let uniqueId = 0;

export default function createContext(defaultValue) {
  const contextProp = '__ctx' + uniqueId++;
  let globalEmitter;
  const defaultEmitter = new Emitter(defaultValue);

  function Provider(passedVal = defaultValue) {
    // const [value, setValue] = useState(passedVal);
    // const [emitter] = useState(() => new Emitter(value));
    const emitter = globalEmitter;
    if (!emitter) {
      globalEmitter = new Emitter(defaultValue);
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
