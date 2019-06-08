#!/usr/bin/env node
'use strict';
const program = require('commander');
const optionsAttachToEnv = require('../src/utils/optionsAttachToEnv');

program
  .option('--type <type>', 'set application type', 'webapp')
  .option('--dir <dir>', 'set project path')
  .option('--debug', 'enabled debug mode', false)
  .option('--target <target>', 'set project path')
  .option('--public-path <publicPath>', 'set bundle assets public path end with `/`', '/')
  .option('--output-path <outputPath>', 'set output path', 'build')
  .option('--analyzer', 'enabled webpack bundle analyzer', false)
  .action((cmd) => {
    optionsAttachToEnv(cmd);
    require('../src/build')(program.type);
  });

program.parse(process.argv);
