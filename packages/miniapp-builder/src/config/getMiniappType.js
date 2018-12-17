const { join } = require('path');
const { existsSync } = require('fs');

/**
 * 判断小程序类型
 * 返回 null 表示两者都不是
 * @param {String} projectDir 项目目录
 */
module.exports = function getMiniappType(projectDir) {
  if (!projectDir) {
    return null;
  }

  if (existsSync(join(projectDir, 'manifest.json'))) {
    return 'sfc'; // 轻应用 sfc dsl
  }

  if (existsSync(join(projectDir, 'app.json'))) {
    return 'mp'; // 小程序 mini program
  }

  if (existsSync(join(projectDir, 'plugin.json'))) {
    return 'plugin'; // 小程序 mini program 插件
  }

  return null;
};
