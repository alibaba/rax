#!/usr/bin/env node
'use strict';
const program = require('commander');

program
  .option('--type <type>', 'set application type, Enum: ["webapp", "miniapp", "miniprogram"].', /^(webapp|miniapp|miniprogram)$/i)
  .option('-p, --port <port>', 'set server port')
  .option('--host <host>', 'set server host')
  .option('--dir <dir>', 'set project path')
  .option('--https', 'enabled https protocol')
  .option('--analyzer', 'enabled webpack bundle analyzer')
  .action(() => {
    require('../src/start')({
      type: program.type,
      port: program.port,
      host: program.host,
      dir: program.dir,
      https: program.https,
      analyzer: program.analyzer,
    });
  });

program.parse(process.argv);
