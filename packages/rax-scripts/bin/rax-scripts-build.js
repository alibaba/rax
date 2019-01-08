#!/usr/bin/env node
'use strict';
const program = require('commander');
const optionsAttachToEnv = require('../src/config/optionsAttachToEnv');

program
  .option('--type <type>', 'set application type, Enum: ["webapp", "miniapp", "miniprogram"].', /^(webapp|miniapp|miniprogram)$/i, 'webapp')
  .option('--dir <dir>', 'set project path')
  .option('--debug', 'enabled debug mode', false)
  .option('--target <target>', 'set project path')
  .option('--public-path <publicPath>', 'set bundle assets public path end with `/`', '/')
  .option('--build-dest <buildDest>', 'build dest', 'build')
  .action((cmd) => {
    optionsAttachToEnv(cmd);
    require('../src/build')(program.type);
  });

program.parse(process.argv);
