export default function findWhere(arr, fn, returnIndex, byValueOnly) {
  let i = arr.length;
  while (i--)
    if (typeof fn === 'function' && !byValueOnly ? fn(arr[i]) : arr[i] === fn)
      break;
  return returnIndex ? i : arr[i];
}
