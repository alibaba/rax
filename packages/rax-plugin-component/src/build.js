'use strict';

const chalk = require('chalk');
const path = require('path');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const fs = require('fs-extra');
const { getBabelConfig } = require('rax-compile-config');

const gulp = require('gulp');
const runSequence = require('run-sequence').use(gulp);

const babelConfig = getBabelConfig({
  styleSheet: true,
  custom: {
    ignore: ['**/**/*.d.ts']
  }
});

const JS_FILES_PATTERN = 'src/**/*.+(js|jsx)';
const OTHER_FILES_PATTERN = 'src/**/*.!(js|jsx|ts|tsx)';
const IGNORE_PATTERN = '**/__tests__/**';

module.exports = (context, options, log) => {
  const { rootDir, userConfig } = context;
  const { enableTypescript } = options;
  const { outputDir } = userConfig;

  log.info('component', chalk.green('Build start... '));

  const BUILD_DIR = path.resolve(rootDir, outputDir);

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

  if (enableTypescript) {
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
        .pipe(gulp.dest(BUILD_DIR))
        .on('end', () => {
          log.info('component', 'Typescript files have been compiled');
        });
    });
  }

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

  let tasks = [
    'clean',
    [
      'js',
      'copyOther',
    ],
  ];

  if (enableTypescript) {
    tasks = [
      'clean',
      [
        'js',
        'ts',
        'copyOther',
      ],
    ];
  }

  runSequence(...tasks, () => {
    log.info('component', chalk.green('Build Successfully'));
  });
};
