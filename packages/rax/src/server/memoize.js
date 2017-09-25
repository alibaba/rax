export default function memoize(func) {
  const memoized = function(...args) {
    const key = JSON.stringify(args);
    const cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };

  memoized.cache = new Map();
  return memoized;
}
