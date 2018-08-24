// https://github.com/dherman/tc39-codex-wiki/blob/master/data/es6/number/index.md

if (Number.EPSILON === undefined) {
  Object.defineProperty(Number, 'EPSILON', {
    value: Math.pow(2, -52),
  });
}

if (Number.MAX_SAFE_INTEGER === undefined) {
  Object.defineProperty(Number, 'MAX_SAFE_INTEGER', {
    value: Math.pow(2, 53) - 1,
  });
}

if (Number.MIN_SAFE_INTEGER === undefined) {
  Object.defineProperty(Number, 'MIN_SAFE_INTEGER', {
    value: -(Math.pow(2, 53) - 1),
  });
}

if (!Number.isNaN) {
  const globalIsNaN = isNaN;
  Object.defineProperty(Number, 'isNaN', {
    configurable: true,
    enumerable: false,
    value: function isNaN(value) {
      return typeof value === 'number' && globalIsNaN(value);
    },
    writable: true,
  });
}

if (!Number.isFinite) {
  const globalIsFinite = isFinite;
  Object.defineProperty(Number, 'isFinite', {
    configurable: true,
    enumerable: false,
    value: function isNaN(value) {
      return typeof value === 'number' && globalIsFinite(value);
    },
    writable: true,
  });
}

if (!Number.isInteger) {
  const floor = Math.floor;
  const globalIsFinite = isFinite;
  Object.defineProperty(Number, 'isInteger', {
    value: function isInteger(value) {
      return typeof value === 'number' && globalIsFinite(value) &&
        value > -9007199254740992 && value < 9007199254740992 &&
        floor(value) === value;
    },
    configurable: true,
    enumerable: false,
    writable: true
  });
}
