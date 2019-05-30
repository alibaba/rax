'use strict';

const colors = require('chalk');
const gulp = require('gulp');
const ts = require('gulp-typescript');
const babel = require('gulp-babel');
const rimraf = require('rimraf');

const babelConfig = require('./babel.config');
const pathConfig = require('../path.config');

const JS_FILES_PATTERN = 'src/**/*.+(js|jsx)';
const OTHER_FILES_PATTERN = 'src/**/*.!(js|jsx|ts|tsx)';
const IGNORE_PATTERN = '**/__tests__/**';
const BUILD_DIR = 'lib';

console.log(colors.green('\n🚀  Build start... '));

const tsProject = ts.createProject('tsconfig.json', {
  skipLibCheck: true,
  declaration: true,
  declarationDir: BUILD_DIR
});

gulp.task('clean', function(done) {
  rimraf(pathConfig.appDist, function() {
    rimraf(BUILD_DIR, done);
  });
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
  const tsResult = tsProject.src().pipe(tsProject());
  return tsResult.pipe(babel(babelConfig)).pipe(gulp.dest(BUILD_DIR));
});

// for other.
gulp.task('other', function() {
  return gulp
    .src([OTHER_FILES_PATTERN], { ignore: IGNORE_PATTERN })
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('default', function(done) {
  gulp.series('clean', gulp.parallel(['babel', 'ts', 'other']))(function() {
    console.log(colors.green('\n🎉  Build successfully.'));
    done();
  });
});
