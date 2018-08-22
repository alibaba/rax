const { setCache } = require('./loader');

module.exports = function transformStyle(styleString, filePath) {
  setCache(filePath, styleString);
};
