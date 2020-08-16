const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Returns an array of the given object's own enumerable entries.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
 */
export function entries(object) {
  // `null` and `undefined` values are not allowed.
  if (object == null) {
    throw new TypeError('Object.entries called on non-object');
  }

  const entries = [];
  for (const key in object) {
    if (hasOwnProperty.call(object, key)) {
      entries.push([key, object[key]]);
    }
  }
  return entries;
}

/**
 * Returns an array of the given object's own enumerable entries.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values
 */
export function values(object) {
  // `null` and `undefined` values are not allowed.
  if (object == null) {
    throw new TypeError('Object.values called on non-object');
  }

  const values = [];
  for (const key in object) {
    if (hasOwnProperty.call(object, key)) {
      values.push(object[key]);
    }
  }
  return values;
}

/**
 * polyfull Object ES8
 */
export function polyfill(ObjectConstructor = Object) {
  if (!ObjectConstructor.values) {
    ObjectConstructor.values = values;
  }

  if (!ObjectConstructor.entries) {
    ObjectConstructor.entries = entries;
  }
}
