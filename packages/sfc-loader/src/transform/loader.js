const loaderUtils = require('loader-utils');
/**
 * for windows issues
 * c:\xxxx\xx.js is not equal to C:\xxxx\xx.js
 * but pointing to the same file content
 * so require.cache can not work properly,
 * object in closure will be created twice
 * to fix this, using global variable instead
 */
const CACHE_KEY = '__cache_sfc_style__';
const cache = global[CACHE_KEY] || (global[CACHE_KEY] = {});

module.exports = function(content) {
  this.cacheable();
  const options = loaderUtils.getOptions(this);
  if (Object.hasOwnProperty.call(options, 'id')) {
    this.callback(null, cache[options.id]);
  } else {
    this.callback(null, '');
  }
};

module.exports.setCache = function(id, content) {
  cache[id] = content;
};
