import Host from './host';
import { isString, isNumber, isObject, isArray } from '../is';
import { invokeMinifiedError } from '../error';

function instantiateComponent(element) {
  let instance;

  if (element === undefined || element === null || element === false || element === true) {
    instance = new Host.Empty();
  } else if (isArray(element)) {
    instance = new Host.Fragment(element);
  } else if (isObject(element) && element.type) {
    // Special case string values
    if (isString(element.type)) {
      instance = new Host.Native(element);
    } else {
      instance = new Host.Composite(element);
    }
  } else if (isString(element) || isNumber(element)) {
    instance = new Host.Text(String(element));
  } else {
    throwInvalidComponentError(element);
  }

  return instance;
}

export function throwInvalidComponentError(element) {
  if (process.env.NODE_ENV === 'production') {
    invokeMinifiedError();
  } else {
    throw new Error(`Invalid element type: ${element}. (current: ${isObject(element) && Object.keys(element) || typeof element})`);
  }
}

export default instantiateComponent;
