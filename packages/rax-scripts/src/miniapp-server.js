/* eslint no-console: 0 */
const { getMiniappType } = require('miniapp-compiler-shared');
const { resolve, isAbsolute } = require('path');

const server = require('miniapp-dev-server/src/server/');

const envConfig = require('./config/env.config');

const TYPE_MAP = {
  sfc: '轻框架',
  mp: '小程序语法',
};
const cwd = process.cwd();
function resolveDir(dir) {
  if (!dir) {
    return cwd;
  } else if (isAbsolute(dir)) {
    return dir;
  } else {
    return resolve(cwd, dir);
  }
}

/**
 * run miniapp webpack dev server
 */
module.exports = function start() {
  const miniappType = getMiniappType(envConfig.dir);
  if (!miniappType) {
    console.log('请检查是否在淘宝轻应用项目中');
    process.exit(1);
  }
  console.log(`检测到 ${TYPE_MAP[miniappType]} 类型项目.`);
  server(resolveDir(envConfig.dir), envConfig.port, envConfig.debug);
};
