#!/usr/bin/env node
'use strict';
const program = require('commander');

program
  .option('--target', 'se Enum: [ali|wx].', /^(ali|wx)$/i, 'ali')
  .option('--output', 'set output folder', 'dist')
  .action((cmd) => {});

program.parse(process.argv);
