import {isArray, isString, isNumber, isObject, isFalsy} from '../types';

function shouldUpdateComponent(prevElement, nextElement) {
  let prevFalsy = isFalsy(prevElement);
  let nextFalsy = isFalsy(nextElement);
  if (prevFalsy || nextFalsy) {
    return prevFalsy === nextFalsy;
  }

  if (isArray(prevElement) && isArray(nextElement)) {
    return true;
  }

  const isPrevStringOrNumber = isString(prevElement) || isNumber(prevElement);
  if (isPrevStringOrNumber) {
    return isString(nextElement) || isNumber(nextElement);
  } else {
    // prevElement and nextElement could be array, typeof [] is "object"
    return (
      isObject(prevElement) &&
      isObject(nextElement) &&
      prevElement.type === nextElement.type &&
      prevElement.key === nextElement.key
    );
  }
}

export default shouldUpdateComponent;
