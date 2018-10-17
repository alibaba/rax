#!/usr/bin/env node
'use strict';
const program = require('commander');
const setOptionsFromProgram = require('../src/config/setOptionsFromProgram');

program
  .option('--target <target>', '设置目标转换类型 ali/wx', /^(ali|wx)$/i, 'ali')
  .option('--output <output>', '设置转换后的文件夹名', 'dist')
  .action((cmd) => {
    setOptionsFromProgram(cmd);
    require('../src/build')();
  });

program.parse(process.argv);
