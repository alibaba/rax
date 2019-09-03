'use strict';

const path = require('path');
const fs = require('fs-extra');

const gulp = require('gulp');
const runSequence = require('run-sequence').use(gulp);

const { registerTasks, filePatterns } = require('./gulpConfig');

const {
  JS_FILES_PATTERN,
  TS_FILES_PATTERN,
  OTHER_FILES_PATTERN,
  IGNORE_PATTERN
} = filePatterns;

module.exports = async(api, options = {}) => {
  const { context, log } = api;
  const { rootDir } = context;
  const enableTypescript = fs.existsSync(path.join(rootDir, 'tsconfig.json'));

  registerTasks({ api, gulp, watch: true });

  const tasks = getTasks(enableTypescript);

  gulp.watch([JS_FILES_PATTERN], { ignore: IGNORE_PATTERN }, ['js']);
  gulp.watch([OTHER_FILES_PATTERN], { ignore: IGNORE_PATTERN }, ['copyOther']);

  if (enableTypescript) {
    gulp.watch([TS_FILES_PATTERN], { ignore: IGNORE_PATTERN }, ['ts']);
  }

  // build web & weex
  runSequence(...tasks, () => {
    log.info('component', 'Watching file changes');
  });
};

function getTasks(enableTS) {
  if (enableTS) {
    return [
      'clean',
      [
        'js',
        'ts',
        'copyOther',
      ],
    ];
  }

  return [
    'clean',
    [
      'js',
      'copyOther',
    ],
  ];
}
