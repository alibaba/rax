export function isNull(obj) {
  return obj === null;
}

export function isFunction(obj) {
  return typeof obj === 'function';
}

export function isObject(obj) {
  return typeof obj === 'object';
}

export function isPlainObject(obj) {
  return EMPTY_OBJECT.toString.call(obj) === '[object Object]';
}

export function isArray(array) {
  return Array.isArray(array);
}

export function isString(string) {
  return typeof string === 'string';
}

export function isNumber(string) {
  return typeof string === 'number';
}

export const NOOP = () => {};
export const EMPTY_OBJECT = {};
