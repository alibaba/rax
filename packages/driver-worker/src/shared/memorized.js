const hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * Create a memorized version of pure function.
 * @note arguments must be stringify, object or function is not acceptable.
 * @param fn {Function}
 */
export default function memorized(fn) {
  const cache = Object.create(null);
  return function cachedFn(...args) {
    const cacheKey = args.join('|');
    return hasOwnProperty.call(cache, cacheKey)
      ? cache[cacheKey]
      : cache[cacheKey] = fn.apply(this, args);
  };
}
