const _ = {
  interopRequire: (obj) => {
    return obj && obj.__esModule ? obj.default : obj;
  },
  firstUpperCase: (str) => {
    return str.toLowerCase().replace(/^\S/g, function (s) { return s.toUpperCase(); });
  },

  purgeRequireCache: (moduleName) => {
    _.searchRequireCache(moduleName, function (mod) {
      delete require.cache[mod.id];
    });

    Object.keys(module.constructor._pathCache).forEach(function (cacheKey) {
      if (cacheKey.indexOf(moduleName) > 0) {
        delete module.constructor._pathCache[cacheKey];
      }
    });
  },

  searchRequireCache: (moduleName, callback) => {
    var mod = require.resolve(moduleName);
    if (mod && ((mod = require.cache[mod]) !== undefined)) {

      (function traverse(mod) {
        mod.children.forEach(function (child) {
          traverse(child);
        });
        callback(mod);
      }(mod));
    }
  }
}

module.exports = _;