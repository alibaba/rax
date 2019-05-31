'use strict';

const path = require('path');

const chalk = require('chalk');


module.exports = function compile() {
  process.stdout.write(chalk.bold.inverse('Compiling packages\n'));
  process.argv.push('--gulpfile', path.resolve(__dirname, '../config/component/gulpfile.js'));
  process.argv.push('--cwd', process.cwd());
  require('gulp-cli')();
  process.stdout.write('\n');
};
