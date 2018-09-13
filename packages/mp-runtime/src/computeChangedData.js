import stringToPath from './stringToPath';
import shallowEqual from './shallowEqual';

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
