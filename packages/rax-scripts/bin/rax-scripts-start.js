#!/usr/bin/env node
'use strict';
/* eslint no-console: 0 */
const program = require('commander');
const spawn = require('cross-spawn');

program
  .option(
    '--type <type>',
    'set application type, Enum: ["rax", "miniapp"].',
    /^(rax|miniapp)$/i,
    'rax',
  )
  .option('-p, --port <port>', 'set server port')
  .option('--host <host>', 'set server host')
  .option('--https', 'enabled https protocol')
  .option('--dir <dir>', 'set project path')
  .option('--debug', 'enabled debug mode')
  .parse(process.argv);

const scriptsMap = {
  rax: require.resolve('../lib/start.js'),
  miniapp: require.resolve('../lib/miniapp-server.js'),
};

const result = spawn.sync('node', [scriptsMap[program.type]], {
  cwd: process.cwd(),
  env: Object.assign(process.env, {
    PORT: process.env.PORT || program.port || '',
    HOST: process.env.HOST || program.host || '',
    HTTPS: process.env.HTTPS || program.https || '',
    DIR: process.env.DIR || program.dir || '',
    DEBUG: process.env.DEBUG || program.debug || '',
  }),
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
