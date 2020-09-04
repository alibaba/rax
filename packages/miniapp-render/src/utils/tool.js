/**
 * Hump to hyphen
 */
function toDash(str) {
  return str.replace(/[A-Z]/g, all => `-${all.toLowerCase()}`);
}

/**
 * Hyphen to hump
 */
function toCamel(str) {
  return str.replace(/-([a-zA-Z])/g, (all, $1) => $1.toUpperCase());
}

/**
 * Get unique id
 */
let seed = 0;
function getId() {
  return seed++;
}

/**
 * Throttling, which is called only once in a synchronous flow
 */
const waitFuncSet = new Set();
function throttle(func) {
  return (...args) => {
    if (waitFuncSet.has(func)) return;

    waitFuncSet.add(func);

    Promise.resolve().then(() => {
      if (waitFuncSet.has(func)) {
        waitFuncSet.delete(func);
        func(...args);
      }
    }).catch(() => {
      // ignore
    });
  };
}

/**
 * Clear throttling cache
 */
function flushThrottleCache() {
  waitFuncSet.forEach(waitFunc => waitFunc && waitFunc());
  waitFuncSet.clear();
}

export default {
  toDash,
  toCamel,
  getId,
  throttle,
  flushThrottleCache,
};
