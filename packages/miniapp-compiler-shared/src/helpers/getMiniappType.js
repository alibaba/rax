const { join } = require('path');
const { existsSync } = require('fs');

/**
 * 判断`轻框架(la)`或者`小程序语法(mp)`
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

  return null;
}