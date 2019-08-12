#!/usr/bin/env node
const { resolve } = require('path');
const program = require('commander');

program
  .option('--type <type>', 'set type of project | component', 'project')
  .option('--entry <entry>', 'set entry of component', 'index')
  .option('--dist <dist>', 'set export path', 'dist')
  .action((cmd) => {
    const workDirectory = resolve(process.env.CWD || process.cwd());
    const distDirectory = resolve(workDirectory, cmd.dist);
    const enableWatch = true;
    const options = {
      webpackConfig: {
        output: {
          path: distDirectory
        }
      },
      workDirectory,
      enableWatch,
      type: cmd.type,
      entry: cmd.type === 'component' ? cmd.entry : 'src/app.js',
      dist: cmd.dist,
    }

    require('..').watch(options);
  });

program.parse(process.argv);
