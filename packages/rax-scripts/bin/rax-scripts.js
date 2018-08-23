#!/usr/bin/env node
'use strict';
const spawn = require('cross-spawn');
const argv = require('minimist')(process.argv.slice(2));

function checkForVersionArgument() {
  if (argv._.length === 0 && (argv.v || argv.version)) {
    console.log('rax-scripts: ' + require('../package.json').version);
    process.exit();
  }
}

checkForVersionArgument();

// minimist api
var commands = argv._;

if (commands.length === 0) {
  console.error(
    'You did not pass any commands, did you mean to run `rax-script build`?',
  );
  process.exit(1);
}

const script = commands[0];

/* eslint no-console: 0 */
var result = spawn.sync('node', [require.resolve('../lib/' + script)], {
  cwd: process.cwd(),
  stdio: 'inherit',
});

if (result.signal === 'SIGKILL') {
  console.log(
    'The build failed because the process exited too early. ' +
      'This probably means the system ran out of memory or someone called ' +
      '`kill -9` on the process.',
  );
} else if (result.signal === 'SIGTERM') {
  console.log(
    'The build failed because the process exited too early. ' +
      'Someone might have called `kill` or `killall`, or the system could ' +
      'be shutting down.',
  );
  process.exit(1);
}

process.exit(result.status);
