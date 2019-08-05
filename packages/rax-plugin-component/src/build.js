'use strict';

const chalk = require('chalk');
const path = require('path');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const fs = require('fs-extra');

const gulp = require('gulp');
const runSequence = require('run-sequence').use(gulp);

const babelConfig = require('./config/babel.config');

const JS_FILES_PATTERN = 'src/**/*.+(js|jsx)';
const OTHER_FILES_PATTERN = 'src/**/*.!(js|jsx|ts|tsx)';
const IGNORE_PATTERN = '**/__tests__/**';

module.exports = (context) => {
  const { rootDir, userConfig } = context;
  const { outputDir } = userConfig;

  const BUILD_DIR = path.resolve(rootDir, outputDir);

  const tsProject = ts.createProject('tsconfig.json', {
    skipLibCheck: true,
    declaration: true,
    declarationDir: BUILD_DIR
  });

  gulp.task('clean', function(done) {
    console.log(chalk.green('\n🚀  Build start... '));
    fs.removeSync(BUILD_DIR);
    done();
  });

  // for js/jsx.
  gulp.task('babel', function() {
    return gulp
      .src([JS_FILES_PATTERN], { ignore: IGNORE_PATTERN })
      .pipe(babel(babelConfig))
      .pipe(gulp.dest(BUILD_DIR));
  });

  // for ts/tsx.
  gulp.task('ts', function() {
    return tsProject.src()
      .pipe(tsProject())
      .on('error', (err) => {
        console.error(err);
        process.exit(1);
      })
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
