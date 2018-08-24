#!/usr/bin/env node
'use strict';
const program = require('commander');
const packageInfo = require('../package.json');

program
  .version(packageInfo.version)
  .usage('<command> [options]')
  .command('build', 'Bundle the project')
  .command(
    'start',
    'Start development services, Default enable hot reload and inline-module-source-map',
  )
  .parse(process.argv);
