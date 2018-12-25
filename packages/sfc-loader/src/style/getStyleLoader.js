/**
 * Get style content by resourcePath
 * for windows issues
 * c:\xxxx\xx.js is not equal to C:\xxxx\xx.js
 * but pointing to the same file content
 * so require.cache can not work properly,
 * object in closure will be created twice
 * to fix this, using global variable instead
 */
const CACHE_KEY = '__sfc_style_cache__';
const cache = global[CACHE_KEY] || (global[CACHE_KEY] = {});

module.exports = function() {
  this.cacheable();
  const id = this.resourcePath;
  this.callback(null, cache[id] || '');
};

module.exports.setCache = function(id, content) {
  cache[id] = content;
};
