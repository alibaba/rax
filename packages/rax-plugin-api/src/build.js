'use strict';

const chalk = require('chalk');
const gulp = require('gulp');

const runSequence = require('run-sequence').use(gulp);

const registerTask = require('./registerTask');

module.exports = (context, options, log) => {
  const tasks = registerTask(context, options, log, gulp);

  log.info('api', chalk.green('Build start... '));

  runSequence(...tasks, () => {
    log.info('api', chalk.green('Build Successfully'));
  });
};
