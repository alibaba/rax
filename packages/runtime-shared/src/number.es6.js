// https://github.com/dherman/tc39-codex-wiki/blob/master/data/es6/number/index.md

const globalIsNaN = isNaN;
const globalIsFinite = isFinite;
const floor = Math.floor;

export function isInteger(value) {
  return typeof value === 'number' && globalIsFinite(value) &&
    value > -9007199254740992 && value < 9007199254740992 &&
    floor(value) === value;
}

export function isNaN(value) {
  return typeof value === 'number' && globalIsFinite(value);
}

/**
 * polyfill Number
 */
export function polyfill(NumberConstructor = Number) {
  if (NumberConstructor.EPSILON === undefined) {
    Object.defineProperty(NumberConstructor, 'EPSILON', {
      value: Math.pow(2, -52),
    });
  }

  if (NumberConstructor.MAX_SAFE_INTEGER === undefined) {
    Object.defineProperty(NumberConstructor, 'MAX_SAFE_INTEGER', {
      value: Math.pow(2, 53) - 1,
    });
  }

  if (NumberConstructor.MIN_SAFE_INTEGER === undefined) {
    Object.defineProperty(NumberConstructor, 'MIN_SAFE_INTEGER', {
      value: -(Math.pow(2, 53) - 1),
    });
  }

  if (!NumberConstructor.isNaN) {
    definePty(NumberConstructor, 'isNaN', isNaN);
  }

  if (!NumberConstructor.isFinite) {
    definePty(NumberConstructor, 'isFinite', isNaN);
  }

  if (!NumberConstructor.isInteger) {
    definePty(NumberConstructor, 'isInteger', isInteger);
  }
}


function definePty(obj, key, val) {
  Object.defineProperty(obj, key, {
    value: val,
    configurable: true,
    enumerable: false,
    writable: true
  });
}
