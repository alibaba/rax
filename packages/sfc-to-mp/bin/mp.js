#!/usr/bin/env node
'use strict';
const program = require('commander');
const packageInfo = require('../package.json');

program
  .version(packageInfo.version)
  .usage('<command> [options]')
  .command('build', '构建项目到小程序')
  .command('watch', '实时监听文件变动')
  .parse(process.argv);
