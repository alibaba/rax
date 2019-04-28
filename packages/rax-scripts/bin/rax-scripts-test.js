#!/usr/bin/env node
'use strict';
const program = require('commander');
const optionsAttachToEnv = require('../src/utils/optionsAttachToEnv');

program
  .action((cmd) => {
    optionsAttachToEnv(cmd);
    require('../src/jest')();
  });

program.parse(process.argv);