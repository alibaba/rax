'use strict';

const chalk = require('chalk');
const gulp = require('gulp');

const runSequence = require('run-sequence').use(gulp);

const registerTask = require('./registerTask');

const {
  JS_FILES_PATTERN,
  TS_FILES_PATTERN,
  OTHER_FILES_PATTERN,
  IGNORE_PATTERN,
} = require('./filePattern');

module.exports = (context, options, log) => {
  const tasks = registerTask(context, options, log, gulp);

  gulp.watch([JS_FILES_PATTERN], { ignore: IGNORE_PATTERN }, ['js']);
  gulp.watch([JS_FILES_PATTERN], { ignore: IGNORE_PATTERN }, ['js']);

  if (options.enableTypescript) {
    gulp.watch([TS_FILES_PATTERN], { ignore: IGNORE_PATTERN }, ['ts']);
  }

  gulp.watch([OTHER_FILES_PATTERN], { ignore: IGNORE_PATTERN }, ['copyOther']);

  log.info('api', chalk.green('Develop watch server start... '));

  runSequence(...tasks, () => {
    log.info('api', chalk.green('Develop watch has been started'));
  });
};
