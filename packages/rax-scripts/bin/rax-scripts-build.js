#!/usr/bin/env node
'use strict';
const program = require('commander');

program
  .option('--type <type>', 'set application type, Enum: ["webapp", "miniapp", "miniprogram"].', /^(webapp|miniapp|miniprogram)$/i)
  .option('--dir <dir>', 'set project path')
  .option('--debug', 'enabled debug mode')
  .option('--target <target>', 'set webpack compile target')
  .option('--public-path <publicPath>', 'set bundle assets public path end with `/`')
  .option('--output-path <outputPath>', 'set output path')
  .action(() => {
    require('../src/build')({
      type: program.type,
      dir: program.dir,
      debug: program.debug,
      target: program.target,
      publicPath: program.publicPath,
      outputPath: program.outputPath,
    });
  });

program.parse(process.argv);
