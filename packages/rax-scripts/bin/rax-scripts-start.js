#!/usr/bin/env node
'use strict';
const program = require('commander');
const optionsAttachToEnv = require('../src/utils/optionsAttachToEnv');

program
  .option('--type <type>', 'set application type', 'webapp')
  .option('-p, --port <port>', 'set server port', 9999)
  .option('--host <host>', 'set server host')
  .option('--dir <dir>', 'set project path')
  .option('--https', 'enabled https protocol', false)
  .option('--analyzer', 'enabled webpack bundle analyzer', false)
  .action((cmd) => {
    optionsAttachToEnv(cmd);
    require('../src/start')(program.type);
  });

program.parse(process.argv);
