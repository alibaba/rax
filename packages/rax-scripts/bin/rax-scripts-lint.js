#!/usr/bin/env node
'use strict';
const program = require('commander');
const optionsAttachToEnv = require('../src/config/optionsAttachToEnv');

program
  .action((cmd) => {
    optionsAttachToEnv(cmd);
    require('../src/lint')();
  });

program.parse(process.argv);