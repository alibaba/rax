#!/usr/bin/env node
const { resolve } = require('path');
const program = require('commander');
const platformConfig = require('../utils/platformConfig');

program
  .option('--type <type>', 'set type of project | component', 'project')
  .option('-p, --platform <platform>', 'set target mini-application platform', 'ali')
  .option('--entry <entry>', 'set entry of component', 'index')
  .option('--dist <dist>', 'set export path', 'dist')
  .action((cmd) => {
    const workDirectory = resolve(process.env.CWD || process.cwd());
    const distDirectory = resolve(workDirectory, cmd.dist);
    const platform = platformConfig[cmd.platform];

    const options = {
      workDirectory,
      distDirectory,
      enableWatch: true,
      type: cmd.type,
      entry: cmd.type === 'component' ? cmd.entry : 'src/app.js',
      dist: cmd.dist,
      platform
    };

    require('..').watch(options);
  });

program.parse(process.argv);
