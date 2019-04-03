#!/usr/bin/env node

const program = require('commander');
const packageInfo = require('../package.json');

program
  .description('Run JSX in mini-program. website: https://github.com/alibaba/rax')
  .version(packageInfo.version)
  .usage('<command> [options]')
  .command('start', 'Start a dev watch mode (hot-reload) to transform project.')
  .command('build', 'Build project in production mode')
  .parse(process.argv);
