const { setCache } = require('./getStyleLoader');

module.exports = function transformStyle(styleString, filePath) {
  setCache(filePath, styleString);
};
