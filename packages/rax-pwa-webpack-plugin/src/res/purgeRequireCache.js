

const searchRequireCache = (moduleName, callback) => {
  var mod = require.resolve(moduleName);
  if (mod && (mod = require.cache[mod]) !== undefined) {
    (function traverse(mod) {
      mod.children.forEach(function(child) {
        traverse(child);
      });
      callback(mod);
    }(mod));
  }
};

const purgeRequireCache = (moduleName) => {
  searchRequireCache(moduleName, function(mod) {
    delete require.cache[mod.id];
  });

  Object.keys(module.constructor._pathCache).forEach(function(cacheKey) {
    if (cacheKey.indexOf(moduleName) > 0) {
      delete module.constructor._pathCache[cacheKey];
    }
  });
};


module.exports = purgeRequireCache;