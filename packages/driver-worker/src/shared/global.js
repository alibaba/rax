const global = typeof global !== 'undefined'
  ? global : typeof self !== 'undefined'
    ? self : new Function('return this')();

export default global;
