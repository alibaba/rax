import { isArray, isString, isNumber, isObject } from '../is';

function shouldUpdateComponent(prevElement, nextElement) {
  let prevEmpty = prevElement === null;
  let nextEmpty = nextElement === null;
  if (prevEmpty || nextEmpty) {
    return prevEmpty === nextEmpty;
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
