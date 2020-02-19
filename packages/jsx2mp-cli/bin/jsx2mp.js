#!/usr/bin/env node

const program = require('commander');
const packageInfo = require('../package.json');

program
  .description('Run JSX in mini-program. website: https://github.com/alibaba/rax')
  .version(packageInfo.version)
  .usage('<command> [options]')
  .command('start', 'Start a dev watch mode (hot-reload) to transform project.')
  .command('build', 'Build project in production mode')
  .on('command:*', (cmd) => {
    if (!program.commands.find(c => c._name == cmd[0])) {
      console.error(`Invalid command: ${program.args.join(' ')}\n`);
      program.outputHelp();
      process.exit(1);
    }
  })
  .parse(process.argv);
