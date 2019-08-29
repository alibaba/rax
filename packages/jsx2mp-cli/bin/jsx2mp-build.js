#!/usr/bin/env node
const { resolve } = require('path');
const program = require('commander');
const { DEFAULT_TYPE, DEFAULT_PLATFORM, DEFAULT_ENTRY, DEFAULT_DIST } = require('../default');

program
  .option('-t, --type <type>', 'set type of project | component', DEFAULT_TYPE)
  .option('-p, --platform <platform>', 'set target mini-application platform', DEFAULT_PLATFORM)
  .option('-e, --entry <entry>', 'set entry of component', DEFAULT_ENTRY)
  .option('-d, --dist <dist>', 'set export path', DEFAULT_DIST)
  .option('-s, --skip-clear-stdout', 'skip clear stdout of screen', false)
  .action((cmd) => {
    const workDirectory = resolve(process.env.CWD || process.cwd());
    const distDirectory = resolve(workDirectory, cmd.dist);

    const options = {
      workDirectory,
      distDirectory,
      enableWatch: false,
      type: cmd.type,
      entry: cmd.entry,
      dist: cmd.dist,
      platform: cmd.platform,
      skipClearStdout: cmd.skipClearStdout,
    };

    require('..').build(options);
  });

program.parse(process.argv);
