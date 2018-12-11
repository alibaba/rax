#!/usr/bin/env node
'use strict';
const program = require('commander');
const optionsAttachToEnv = require('../src/config/optionsAttachToEnv');

program
  .option('--type <type>', 'set application type, Enum: ["webapp", "miniapp"].', /^(webapp|miniapp)$/i, 'webapp')
  .option('--dir <dir>', 'set project path')
  .option('--debug', 'enabled debug mode', false)
  .option('--public-path <publicPath>', 'set bundle assets public path end with `/`', '/')
  .action((cmd) => {
    optionsAttachToEnv(cmd);
    require('../src/build')(program.type);
  });

program.parse(process.argv);
