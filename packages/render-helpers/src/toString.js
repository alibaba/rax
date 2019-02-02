/**
 * Stringify an value.
 * @param val {String|Object|Function|Array} value.
 * @return {String}
 */
export default function toString(val) {
  if (val === undefined || val === null) {
    return '';
  } else {
    return typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : '' + val;
  }
};
