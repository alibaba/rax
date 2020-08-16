/**
 * Invoke modules.
 * @param modules
 * @param key
 * @param args Remain arguments.
 */
module.exports = function invokeModules(modules, key, ...args) {
  if (Array.isArray(modules)) {
    for (let i = 0, l = modules.length; i < l; i ++) {
      if (typeof modules[i][key] === 'function') {
        modules[i][key].apply(modules[i], args);
      }
    }
  }
};
