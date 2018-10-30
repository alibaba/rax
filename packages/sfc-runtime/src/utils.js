import uppercamelcase from 'uppercamelcase';
import camelcase from 'camelcase';

export { isWeb, isNode, isWeex, isReactNative } from 'universal-env';

// including any obj
export function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

export function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

export function isNative(Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
}

export function noop() { }

/**
 * Parse simple path.
 */
const bailRE = /[^\w.$]/;
export function parsePath(path) {
  if (bailRE.test(path)) {
    return;
  }
  const segments = path.split('.');
  return function(obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) {
        return;
      }
      obj = obj[segments[i]];
    }
    return obj;
  };
}

export function kebabCase(string) {
  let kebab = '';
  for (let i = 0, l = string.length; i < l; i++) {
    if (/[a-z]/.test(string[i])) {
      kebab += string[i];
    } else if (/[A-Z]/.test(string[i])) {
      kebab += '-' + string[i].toLowerCase();
    } else if (string[i] === '-') {
      kebab += '-';
    }
  }
  if (kebab[0] === '-') {
    return kebab.slice(1);
  } else {
    return kebab;
  }
}

function runtimeWarn(...args) {
  console.warn.call(console, '[SFC WARN]', ...args);
}

export { uppercamelcase, camelcase, runtimeWarn as warn };