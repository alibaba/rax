#!/usr/bin/env node
const { resolve } = require('path');
const program = require('commander');
const platformConfig = require('../utils/platformConfig');

program
  .option('-e, --entry <entry>', 'set entry of component', 'index')
  .option('-p, --platform <platform>', 'set target mini-application platform', 'ali')
  .option('-t, --type <type>', 'set type of project|component', 'project')
  .option('-d, --dist <dist>', 'set export path', 'dist')
  .action((cmd) => {
    const workDirectory = resolve(process.env.CWD || process.cwd());
    const distDirectory = resolve(workDirectory, cmd.dist);
    const platform = platformConfig[cmd.platform];

    require('..').watch({
      workDirectory,
      distDirectory,
      enableWatch: true,
      type: cmd.type,
      dist: cmd.dist,
      entry: cmd.entry,
      platform,
    });
  });

program.parse(process.argv);
