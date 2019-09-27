export function isNull(obj) {
  return obj === null;
}

export function isFunction(obj) {
  return typeof obj === 'function';
}

export function isObject(obj) {
  return typeof obj === 'object';
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
