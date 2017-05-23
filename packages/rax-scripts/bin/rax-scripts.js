#!/usr/bin/env node
'use strict';
const spawn = require('cross-spawn');

const script = process.argv[2];
const args = process.argv.slice(3);

/* eslint no-console: 0 */
switch (script) {
  case 'build':
  case 'start':
    var result = spawn.sync(
      'node', [require.resolve('../lib/scripts/' + script)].concat(args), {
        cwd: process.cwd(),
        stdio: 'inherit'
      }
    );
    if (result.signal === 'SIGKILL') {
      console.log(
        'The build failed because the process exited too early. ' +
        'This probably means the system ran out of memory or someone called ' +
        '`kill -9` on the process.'
      );
    } else if (result.signal === 'SIGTERM') {
      console.log(
        'The build failed because the process exited too early. ' +
        'Someone might have called `kill` or `killall`, or the system could ' +
        'be shutting down.'
      );
      process.exit(1);
    }
    process.exit(result.status);
    break;
  default:
    console.log('Unknown script "' + script + '".');
    break;
}
