#!/usr/bin/env node
const { resolve } = require('path');
const program = require('commander');

program
  // .option('-w, --watch', 'Enable watch.', true)
  .action((cmd) => {
    const workDirectory = resolve(process.env.CWD || process.cwd());
    const distDirectory = resolve(workDirectory, 'dist');

    // const enableWatch = (!'watch' in cmd) || cmd.watch;
    const enableWatch = true; // In developing.
    require('..')(workDirectory, distDirectory, enableWatch);
  });

program.parse(process.argv);
