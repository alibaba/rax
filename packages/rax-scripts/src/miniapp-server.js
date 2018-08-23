#!/usr/bin/env node
/* eslint no-console: 0 */
const { getMiniappType } = require('miniapp-compiler-shared');
const { resolve, isAbsolute } = require('path');

const envConfig = require('./config/env.config');
const server = require('miniapp-dev-server/lib/server/');

console.log(process.env.DEBUG, typeof process.env.DEBUG);

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

function start(dir, port, debug) {
  const miniappType = getMiniappType(dir);
  if (!miniappType) {
    console.log('请检查是否在淘宝轻应用项目中');
    process.exit(1);
  }
  console.log(`检测到 ${TYPE_MAP[miniappType]} 类型项目.`);
  console.log(dir, port, debug, typeof debug);
  server(resolveDir(dir), port, debug);
}

start(envConfig.dir, envConfig.port, envConfig.debug);
