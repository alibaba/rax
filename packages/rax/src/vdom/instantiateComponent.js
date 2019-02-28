import Host from './host';

function instantiateComponent(element) {
  let instance;

  if (element === undefined || element === null || element === false || element === true) {
    instance = new Host.Empty();
  } else if (Array.isArray(element)) {
    instance = new Host.Fragment(element);
  } else if (typeof element === 'object' && element.type) {
    // Special case string values
    if (typeof element.type === 'string') {
      instance = new Host.Native(element);
    } else {
      instance = new Host.Composite(element);
    }
  } else if (typeof element === 'string' || typeof element === 'number') {
    instance = new Host.Text(String(element));
  } else {
    throwInvalidComponentError(element);
  }

  return instance;
}

export function throwInvalidComponentError(element) {
  throw Error(`Invalid element type: ${element}. (current: ${typeof element === 'object' && Object.keys(element) || typeof element})`);
}

export default instantiateComponent;
