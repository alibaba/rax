/**
 * Get current runtime's global object
 */
const global = typeof global !== 'undefined'
  ? global
  : typeof self !== 'undefined'
    ? self
      : new Function('return this')(); // eslint-disable-line

export default global;
