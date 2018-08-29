#!/usr/bin/env node

const program = require('commander');
const pkgJSON = require('../package.json');
const { getMiniappType } = require('miniapp-compiler-shared');
const { resolve, join, isAbsolute } = require('path');
const { existsSync } = require('fs');

const cwd = process.cwd();
const DEFAULT_PORT = 8081;
const DEFAULT_WORKDIR = cwd;
const TYPE_MAP = {
  sfc: '轻框架',
  mp: '小程序语法',
};

program
  .version(pkgJSON.version)
  .option('-d, --dir <dir>', '指定当前工作目录, 默认为当前目录')
  .option('-p, --port <port>', '程序启动端口号, 默认为 6001')
  .option('-b, --debug', '调试模式, 默认 false')
  .parse(process.argv);

const workDir = program.dir ? resolveDir(program.dir) : DEFAULT_WORKDIR;
const port = program.port || DEFAULT_PORT;
const isDebug = !!program.debug;
const miniappType = getMiniappType(workDir);

if (!miniappType) {
  console.log('请检查是否在淘宝轻应用项目中');
  process.exit(1);
} else {
  console.log(`检测到 ${TYPE_MAP[miniappType]} 类型项目.`);
  require('../src/server')(workDir, port, isDebug);
}

function resolveDir(dir) {
  if (!dir) {
    return cwd;
  } else if (isAbsolute(dir)) {
    return dir;
  } else {
    return resolve(cwd, dir);
  }
}
