/* eslint-disable no-bitwise, no-extend-native, radix, no-self-compare, consistent-this */

/**
 * Creates an array from array like objects.
 *
 * https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
 */
export function ArrayFrom(arrayLike /* , mapFn, thisArg */) {
  if (arrayLike == null) {
    throw new TypeError('Object is null or undefined');
  }

  // Optional args.
  var mapFn = arguments[1];
  var thisArg = arguments[2];

  var C = this;
  var items = Object(arrayLike);
  var symbolIterator =
    typeof Symbol === 'function' ? Symbol.iterator : '@@iterator';
  var mapping = typeof mapFn === 'function';
  var usingIterator = typeof items[symbolIterator] === 'function';
  var key = 0;
  var ret;
  var value;

  if (usingIterator) {
    ret = typeof C === 'function' ? new C() : [];
    var it = items[symbolIterator]();
    var next;

    while (!(next = it.next()).done) {
      value = next.value;

      if (mapping) {
        value = mapFn.call(thisArg, value, key);
      }

      ret[key] = value;
      key += 1;
    }

    ret.length = key;
    return ret;
  }

  var len = items.length;
  if (isNaN(len) || len < 0) {
    len = 0;
  }

  ret = typeof C === 'function' ? new C(len) : new Array(len);

  while (key < len) {
    value = items[key];

    if (mapping) {
      value = mapFn.call(thisArg, value, key);
    }

    ret[key] = value;

    key += 1;
  }

  ret.length = key;
  return ret;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of#Polyfill
export function ArrayOf() {
  return Array.prototype.slice.call(arguments);
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
export function findIndex(predicate, context) {
  if (this == null) {
    throw new TypeError(
      'Array.prototype.findIndex called on null or undefined',
    );
  }
  if (typeof predicate !== 'function') {
    throw new TypeError('predicate must be a function');
  }
  var list = Object(this);
  var length = list.length >>> 0;
  for (var i = 0; i < length; i++) {
    if (predicate.call(context, list[i], i, list)) {
      return i;
    }
  }
  return -1;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
export function find(predicate, context) {
  if (this == null) {
    throw new TypeError('Array.prototype.find called on null or undefined');
  }
  var index = findIndex.call(this, predicate, context);
  return index === -1 ? undefined : this[index];
}

/**
 * polyfill ES6 Array
 */
export function polyfill(ArrayConstructor = Array) {
  if (!ArrayConstructor.from) {
    ArrayConstructor.from = ArrayFrom;
  }

  if (!ArrayConstructor.of) {
    ArrayConstructor.of = ArrayOf;
  }

  if (!ArrayConstructor.prototype.findIndex) {
    Object.defineProperty(ArrayConstructor.prototype, 'findIndex', {
      enumerable: false,
      writable: true,
      configurable: true,
      value: findIndex,
    });
  }

  if (!ArrayConstructor.prototype.find) {
    Object.defineProperty(ArrayConstructor.prototype, 'find', {
      enumerable: false,
      writable: true,
      configurable: true,
      value: find,
    });
  }
}
