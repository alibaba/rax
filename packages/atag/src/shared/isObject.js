/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @param {*} value The value to check.
 * @returns {Boolean} Returns `true` if `value` is an object, else `false`.
 */
export default function isObject(value) {
  let type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}
