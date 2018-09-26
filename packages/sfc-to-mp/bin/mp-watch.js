#!/usr/bin/env node
'use strict';
const program = require('commander');
const optionsAttachToEnv = require('../src/config/optionsAttachToEnv');

program
  .option('--target <target>', 'se Enum: [ali|wx].', /^(ali|wx)$/i, 'ali')
  .option('--output <output>', 'set output folder', 'dist')
  .action((cmd) => {
    optionsAttachToEnv(cmd);
    require('../src/watch')();
  });

program.parse(process.argv);
