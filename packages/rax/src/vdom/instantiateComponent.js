import Host from './host';
import {isString, isNumber, isArray, isNull, isPlainObject} from '../types';
import { throwMinifiedWarn, throwError } from '../error';

export default function instantiateComponent(element) {
  let instance;

  if (isPlainObject(element) && element !== null && element.type) {
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
    if (!(element === undefined || isNull(element) || element === false || element === true)) {
      if (process.env.NODE_ENV !== 'production') {
        throwError('Invalid child type, expected types: Element instance, string, boolean, array, null, undefined.', element);
      } else {
        throwMinifiedWarn(2, element);
      }
    }

    instance = new Host.__Empty(element);
  }

  return instance;
}
