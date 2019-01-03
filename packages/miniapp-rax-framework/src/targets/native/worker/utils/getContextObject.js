/**
 * Get current runtime context object
 */
export default function getContextObject() {
  return typeof global !== 'undefined'
    ? global
    : typeof self !== 'undefined'
      ? self
      : (new Function('return this'))() // eslint-disable-line
}
