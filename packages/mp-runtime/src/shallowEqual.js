export default function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }
  let keysA = Object.keys(objA);
  let keysB = Object.keys(objB);
  const len = keysA.length;
  if (len !== keysB.length) {
    return false;
  }
  for (let i = 0; i < len; i++) {
    const key = keysA[i];
    if (!objB.hasOwnProperty(key)) {
      return false;
    }
    if (objA[key] !== objB[key]) {
      return false;
    }
  }
  return true;
}
