/**
 * Invoke modules.
 * @param modules
 * @param iter
 * @param key
 */
module.exports = function invokeModules(modules, iter, key) {
  if (Array.isArray(modules)) {
    for (let i = 0, l = modules.length; i < l; i ++) {
      if (typeof modules[i][key] === 'function') {
        modules[i][key](iter);
      }
    }
  }
}
