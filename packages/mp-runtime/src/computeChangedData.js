import shallowEqual from './shallowEqual';

const reLeadingDot = /^\./;
// a..b
// a[][]b
const rePropName = /[^.[\]]+|\[(?:(-?\d+)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
/** Used to match backslashes in property paths. */
const reEscapeChar = /\\(\\)?/g;
const stringToPathCache = {};

function stringToPath(stringPath) {
  if (stringToPathCache[stringPath]) {
    return stringToPathCache[stringPath];
  }
  const result = [];
  if (reLeadingDot.test(stringPath)) {
    result.push('');
  }
  stringPath.replace(rePropName, (match, num, quote, str) => {
    let part = match;
    if (quote) {
      part = str.replace(reEscapeChar, '$1');
    } else if (num) {
      part = parseInt(num, 10);
    }
    result.push(part);
  });
  stringToPathCache[stringPath] = result;
  return result;
}

function clone(obj, assumeArray) {
  if (!obj) {
    return assumeArray ? [] : {};
  } else if (Array.isArray(obj)) {
    return obj.slice();
  }
  return { ...obj };
}

function set(dest, src, path, changeCallback, deep) {
  let currentPath = path[0];
  if (deep && dest === src || !dest) {
    dest = clone(src, typeof currentPath === 'number');
  }
  if (path.length === 1) {
    return changeCallback(dest, currentPath);
  }
  if (src) {
    src = src[currentPath];
  }
  dest[currentPath] = set(dest[currentPath], src, path.slice(1), changeCallback, true);
  return dest;
}

/**
 * Get changed data, just changed keys will included.
 * eg:
 *   originalData: { foo: 'some val', bar: '' }
 *   changedData: { foo: 'new val' }
 *   returns: { foo: 'new val' }
 * @param originalData
 * @param changedData
 * @returns {Object}
 */
export default function computeChangedData(originalData, changedData) {
  let ret = { ...originalData };
  Object.keys(changedData).forEach((pathString) => {
    const path = stringToPath(pathString);
    set(ret, ret, path, (clonedObj, finalPath) => {
      clonedObj[finalPath] = changedData[pathString];
      return clonedObj;
    });
  });
  if (shallowEqual(ret, originalData)) {
    return originalData;
  }
  return ret;
}
