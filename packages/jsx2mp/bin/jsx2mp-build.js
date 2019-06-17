#!/usr/bin/env node
const { resolve } = require('path');
const program = require('commander');

program
  .option('--entry <entry>', 'set entry of component', 'index')
  .option('--type <type>', 'set type of project|component', 'project')
  .option('--dist <dist>', 'set export path', 'dist')
  .action((cmd) => {
    const workDirectory = resolve(process.env.CWD || process.cwd());
    const distDirectory = resolve(workDirectory, cmd.dist);

    require('..')(workDirectory, distDirectory, {
      enableWatch: false,
      type: cmd.type,
      dist: cmd.dist,
      entry: cmd.entry,
    });
  });

program.parse(process.argv);
