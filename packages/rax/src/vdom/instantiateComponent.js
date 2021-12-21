import Host from './host';
import {isString, isNumber, isArray, isNull, isPlainObject} from '../types';
import { throwMinifiedWarn, throwError } from '../error';
import { SUSPENSE, LAZY_TYPE } from '../constant';

export default function instantiateComponent(element) {
  let instance;

  // Lazy element (eg. server component)
  if (element && element.$$typeof === LAZY_TYPE) {
    const payload = element._payload;
    const init = element._init;
    element = init(payload);
  }

  if (isPlainObject(element) && element !== null && element.type) {
    // Lazy component
    if (element.type.$$typeof === LAZY_TYPE) {
      const payload = element.type._payload;
      const init = element.type._init;
      const type = init(payload);

      element.type = type;
      instance = instantiateComponent(element);
    } else if (element.type === SUSPENSE) { // Special case string values
      instance = new Host.__Suspense(element);
    } else if (isString(element.type)) {
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
