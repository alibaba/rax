'use strict';

const isDev = typeof __DEV__ === 'boolean' && __DEV__;

let warning = () => {};

if (isDev) {
  function printWarning(format, ...args) {
    let argIndex = 0;
    let message = 'Warning: ' + format.replace(/%s/g, () => args[argIndex++]);
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      throw new Error(message);
    } catch (x) {}
  }

  warning = function(condition, format, ...args) {
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
        'message argument'
      );
    }
    if (!condition) {
      printWarning(format, ...args);
    }
  };
}

export default warning;
