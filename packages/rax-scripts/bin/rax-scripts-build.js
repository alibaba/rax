#!/usr/bin/env node
'use strict';
const program = require('commander');
const optionsAttachToEnv = require('../src/config/optionsAttachToEnv');

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
    require('../src/build')(program.type);
  });

program.parse(process.argv);
