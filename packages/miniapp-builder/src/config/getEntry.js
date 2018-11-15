const { resolve } = require('path');

/**
 * 获取 webpack entry
 * @param {String} projectDir 项目路径
 */
module.exports = function getEntry(projectDir) {
  return {
    app: resolve(projectDir, 'app.js'),
  };
};
