import Host from './host';

function instantiateComponent(element) {
  let instance;

  if (element === undefined || element === null || element === false || element === true) {
    instance = new Host.EmptyComponent();
  } else if (Array.isArray(element)) {
    instance = new Host.FragmentComponent(element);
  } else if (typeof element === 'object' && element.type) {
    // Special case string values
    if (typeof element.type === 'string') {
      instance = new Host.NativeComponent(element);
    } else {
      instance = new Host.CompositeComponent(element);
    }
  } else if (typeof element === 'string' || typeof element === 'number') {
    instance = new Host.TextComponent(element);
  } else {
    throwInvalidComponentError(element);
  }

  instance._mountIndex = 0;

  return instance;
}

export function throwInvalidComponentError(element) {
  throw Error(`Invalid element type: ${element}. (current: ${typeof element === 'object' && Object.keys(element) || typeof element})`);
}

export default instantiateComponent;
