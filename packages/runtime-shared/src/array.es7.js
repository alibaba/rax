/* eslint-disable no-bitwise, no-extend-native, radix, no-self-compare, consistent-this */

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
export function ArrayIncludes(searchElement) {
  var O = Object(this);
  var len = parseInt(O.length) || 0;
  if (len === 0) {
    return false;
  }
  var n = parseInt(arguments[1]) || 0;
  var k;
  if (n >= 0) {
    k = n;
  } else {
    k = len + n;
    if (k < 0) {
      k = 0;
    }
  }
  var currentElement;
  while (k < len) {
    currentElement = O[k];
    if (
      searchElement === currentElement ||
      searchElement !== searchElement && currentElement !== currentElement
    ) {
      return true;
    }
    k++;
  }
  return false;
}

/**
 * polyfill ES7 Array
 */
export function polyfill(ArrayConstructor = Array) {
  if (!ArrayConstructor.prototype.includes) {
    Object.defineProperty(ArrayConstructor.prototype, 'includes', {
      enumerable: false,
      writable: true,
      configurable: true,
      value: ArrayIncludes,
    });
  }
}
