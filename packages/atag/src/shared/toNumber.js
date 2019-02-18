import isObject from './isObject';

/**
 * Used as references for various `Number` constants.
 */
const NAN = 0 / 0;

/**
 * Used to match leading and trailing whitespace.
 */
const reTrim = /^\s+|\s+$/g;

/**
 * Used to detect bad signed hexadecimal string values.
 */
const reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/**
 * Used to detect binary string values.
 */
const reIsBinary = /^0b[01]+$/i;

/**
 * Used to detect octal string values.
 */
const reIsOctal = /^0o[0-7]+$/i;

/**
 * Built-in method references without a dependency on `root`.
 */
const freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 */
export default function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }

  if (typeof value === 'symbol') {
    return NAN;
  }

  if (isObject(value)) {
    let other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? other + '' : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');

  let isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value)
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : reIsBadHex.test(value) ? NAN : +value;
}
