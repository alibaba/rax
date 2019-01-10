const supportWeakSet = typeof WeakSet !== 'undefined';
const supportWeakMap = typeof WeakMap !== 'undefined';

const cache = new WeakMap();
/**
 * Deep Copy from rfdc(really fast deep copy)
 */
export default function deepCopy(o) {
  let cachedValue = cache.get(o);
  if (cachedValue) return cachedValue;

  // Shallow copy
  if (typeof o !== 'object' || o === null) return o;
  if (o instanceof Promise) return o;
  if (supportWeakSet && o instanceof WeakSet) return o;
  if (supportWeakMap && o instanceof WeakMap) return o;

  // Clone
  if (o instanceof Date) return new Date(o);
  if (o instanceof Boolean) return new Boolean(o.valueOf());
  if (o instanceof Number) return new Number(o.valueOf());
  if (o instanceof String) return new String(o.valueOf());
  if (o instanceof RegExp) return new RegExp(o.source, o.flags);

  if (Array.isArray(o)) return cloneArray(o, deepCopy);

  // Copy plain object
  const o2 = {};

  // In case of circular object.
  cache.set(o, o2);

  for (let k in o) {
    let propDesc = Object.getOwnPropertyDescriptor(o, k);
    let cur = propDesc.value;
    if (propDesc.get || propDesc.set) {
      Object.defineProperty(o2, k, propDesc);
    } else if (typeof cur !== 'object' || cur === null) {
      o2[k] = cur;
    } else if (cur instanceof Date) {
      o2[k] = new Date(cur);
    } else {
      o2[k] = deepCopy(cur);
    }
  }

  // Delete cache, or deepCopy the same object more than once will get a same ref.
  cache.delete(o);
  return o2;
}

function cloneArray(a, fn) {
  const keys = Object.keys(a);
  const a2 = new Array(keys.length);
  for (var i = 0; i < keys.length; i++) {
    const k = keys[i];
    const cur = a[k];
    if (typeof cur !== 'object' || cur === null) {
      a2[k] = cur;
    } else if (cur instanceof Date) {
      a2[k] = new Date(cur);
    } else {
      a2[k] = fn(cur);
    }
  }
  return a2;
}
