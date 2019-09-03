'use strict';

const path = require('path');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const fs = require('fs-extra');
const { getBabelConfig } = require('rax-compile-config');

const {
  JS_FILES_PATTERN,
  OTHER_FILES_PATTERN,
  IGNORE_PATTERN
} = require('./filePatterns');

const babelConfig = getBabelConfig({
  styleSheet: true,
  custom: {
    ignore: ['**/**/*.d.ts']
  }
});

module.exports = async({
  api,
  gulp,
  watch
}) => {
  const { context, log } = api;
  const { rootDir, userConfig } = context;
  const { outputDir, devOutputDir } = userConfig;

  const BUILD_DIR = path.resolve(rootDir, watch ? devOutputDir : outputDir);

  gulp.task('clean', function(done) {
    log.info('component', `Cleaning build directory ${BUILD_DIR}`);
    fs.removeSync(BUILD_DIR);
    log.info('component', 'Build directory has been Cleaned');
    done();
  });

  // for js/jsx.
  gulp.task('js', function() {
    log.info('component', 'Compiling javascript files');
    return gulp
      .src([JS_FILES_PATTERN], { ignore: IGNORE_PATTERN })
      .pipe(babel(babelConfig))
      .pipe(gulp.dest(BUILD_DIR))
      .on('end', () => {
        log.info('component', 'Javascript files have been compiled');
      });
  });

  const tsProject = ts.createProject('tsconfig.json', {
    skipLibCheck: true,
    declaration: true,
    declarationDir: BUILD_DIR,
    outDir: BUILD_DIR
  });

  // for ts/tsx.
  gulp.task('ts', function() {
    log.info('component', 'Compiling typescript files');
    return tsProject.src()
      .pipe(tsProject())
      .pipe(babel(babelConfig))
      .pipe(gulp.dest(BUILD_DIR))
      .on('end', () => {
        log.info('component', 'Typescript files have been compiled');
      });
  });

  // for other.
  gulp.task('copyOther', function() {
    log.info('component', 'Copy other files');
    return gulp
      .src([OTHER_FILES_PATTERN], { ignore: IGNORE_PATTERN })
      .pipe(gulp.dest(BUILD_DIR))
      .on('end', () => {
        log.info('component', 'Other Files have been copied');
      });
  });

  // for miniapp build
  const buildTemp = path.resolve(rootDir, outputDir, 'miniappTemp');
  gulp.task('miniappClean', function(done) {
    log.info('component', `Cleaning miniapp build directory ${buildTemp}`);
    fs.removeSync(buildTemp);
    log.info('component', 'Build directory has been Cleaned');
    done();
  });

  const miniappTsProject = ts.createProject('tsconfig.json', {
    skipLibCheck: true,
    declaration: true,
    declarationDir: BUILD_DIR,
    outDir: BUILD_DIR
  });

  //  build ts/tsx to miniapp
  gulp.task('miniappTs', function() {
    log.info('component', 'Compiling typescript files for miniapp');
    return miniappTsProject.src()
      .pipe(miniappTsProject())
      .pipe(gulp.dest(buildTemp))
      .on('end', () => {
        log.info('component', 'Typescript files have been compiled');
      });
  });

  // for other.
  gulp.task('miniappCopyOther', function() {
    log.info('component', 'Copy other files for miniapp');
    return gulp
      .src([OTHER_FILES_PATTERN], { ignore: IGNORE_PATTERN })
      .pipe(gulp.dest(buildTemp))
      .on('end', () => {
        log.info('component', 'Other Files have been copied');
      });
  });
};
