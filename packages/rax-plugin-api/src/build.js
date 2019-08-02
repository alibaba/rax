'use strict';

const chalk = require('chalk');
const path = require('path');
const gulp = require('gulp');
const ts = require('gulp-typescript');
const babel = require('gulp-babel');
const fs = require('fs-extra');
const runSequence = require('run-sequence').use(gulp);

module.exports = (rootDir) => {
  const babelConfig = require('./babel.config');

  const JS_FILES_PATTERN = 'src/**/*.+(js|jsx)';
  const TS_FILES_PATTERN = 'src/**/*.+(ts|tsx)';
  const OTHER_FILES_PATTERN = 'src/**/*.!(js|jsx|ts|tsx)';
  const IGNORE_PATTERN = '**/__tests__/**';

  const BUILD_DIR = path.resolve(rootDir, 'lib');

  console.log(chalk.green('\n🚀  Build start... '));

  const tsProject = ts.createProject('tsconfig.json', {
    skipLibCheck: true,
    declaration: true,
    declarationDir: BUILD_DIR
  });

  gulp.task('clean', function(done) {
    fs.removeSync(BUILD_DIR);
    done();
  });

  // for js/jsx.
  gulp.task('js', function() {
    return gulp
      .src([JS_FILES_PATTERN], { ignore: IGNORE_PATTERN })
      .pipe(babel(babelConfig))
      .pipe(gulp.dest(BUILD_DIR));
  });

  // for ts/tsx.
  gulp.task('ts', function() {
    return tsProject.src().pipe(tsProject())
      .on('error', (err) => {
        console.error(err);
        process.exit(1);
      })
      .pipe(gulp.dest(BUILD_DIR));
  });

  // for other.
  gulp.task('copyOther', function() {
    return gulp
      .src([OTHER_FILES_PATTERN], { ignore: IGNORE_PATTERN })
      .pipe(gulp.dest(BUILD_DIR));
  });

  runSequence(
    'clean',
    [
      'js',
      'ts',
      'copyOther',
    ],
    () => {
      console.log(chalk.green('\n  Build Successfully... '));
    });
};
