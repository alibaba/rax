export default typeof global !== 'undefined' ? global
  : typeof self !== 'undefined' ? self
    : (new Function('return this'))(); // eslint-disable-line
