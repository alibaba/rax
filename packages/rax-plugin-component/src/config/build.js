'use strict';

const chalk = require('chalk');
const path = require('path');
const babel = require('gulp-babel');
const fs = require('fs-extra');

const gulp = require('gulp');
const runSequence = require('run-sequence').use(gulp);

const babelConfig = require('./babel.config');

const JS_FILES_PATTERN = 'src/**/*.+(js|jsx)';
const OTHER_FILES_PATTERN = 'src/**/*.!(js|jsx|ts|tsx)';
const IGNORE_PATTERN = '**/__tests__/**';

module.exports = (rootDir) => {
  const BUILD_DIR = path.resolve(rootDir, 'lib');

  gulp.task('clean', function(done) {
    console.log(chalk.green('\n🚀  Build start... '));
    fs.removeSync(path.resolve(rootDir, 'dist'));
    done();
  });

  // for js/jsx.
  gulp.task('babel', function() {
    return gulp
      .src([JS_FILES_PATTERN], { ignore: IGNORE_PATTERN })
      .pipe(babel(babelConfig))
      .pipe(gulp.dest(BUILD_DIR));
  });

  // for other.
  gulp.task('other', function() {
    return gulp
      .src([OTHER_FILES_PATTERN], { ignore: IGNORE_PATTERN })
      .pipe(gulp.dest(BUILD_DIR));
  });

  runSequence(
    'clean',
    [
      'babel',
      'other',
    ],
    () => {
      console.log(chalk.green('\n🎉  Build successfully.'));
    });
};
