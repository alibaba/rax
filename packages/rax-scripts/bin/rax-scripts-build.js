#!/usr/bin/env node
'use strict';
/* eslint no-console: 0 */
const program = require('commander');
const optionsAttachToEnv = require('../lib/config/optionsAttachToEnv');

program
  .option(
    '--type <type>',
    'set application type, Enum: ["rax", "miniapp"].',
    /^(rax|miniapp)$/i,
    'rax',
  )
  .option('-p, --port <port>', 'set server port', 9999)
  .option('--host <host>', 'set server host')
  .option('--dir <dir>', 'set project path')
  .option('--https', 'enabled https protocol', false)
  .option('--debug', 'enabled debug mode', false)
  .action((cmd) => {
    optionsAttachToEnv(cmd);
    if (program.type == 'rax') {
      require('../src/build')();
    } else if (program.type == 'miniapp') {
      require('../src/miniapp-build')();
    }
  });

program.parse(process.argv);
