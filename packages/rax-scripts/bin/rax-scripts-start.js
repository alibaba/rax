#!/usr/bin/env node
'use strict';
const program = require('commander');
const { dev } = require('scripts-core');

program
  .option('--config <config>', 'use custom config')
  .action((cmd) => {
    dev({
      args: {
        config: cmd.config
      }
    });
  })
  .parse(process.argv);
