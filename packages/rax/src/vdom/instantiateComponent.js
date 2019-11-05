import Host from './host';
import {isString, isNumber, isObject, isArray, isNull} from '../types';
import warning from '../warning';

export default function instantiateComponent(element) {
  let instance;

  if (isObject(element) && element !== null && element.type) {
    // Special case string values
    if (isString(element.type)) {
      instance = new Host.__Native(element);
    } else {
      instance = new Host.__Composite(element);
    }
  } else if (isString(element) || isNumber(element)) {
    instance = new Host.__Text(String(element));
  } else if (isArray(element)) {
    instance = new Host.__Fragment(element);
  } else {
    if (process.env.NODE_ENV !== 'production') {
      if (!(element === undefined || isNull(element) || element === false || element === true)) {
        let typeInfo = isObject(element) ? `object with keys {${Object.keys(element).join(', ')}}` : typeof element;
        warning(`Invalid element type (found: ${typeInfo}).`);
      }
    }

    instance = new Host.__Empty();
  }

  return instance;
}
