'use strict';

const chalk = require('chalk');
const path = require('path');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const fs = require('fs-extra');
const { getBabelConfig } = require('rax-compile-config');

const gulp = require('gulp');
const runSequence = require('run-sequence').use(gulp);
const mpBuild = require('./config/miniapp/build');

const babelConfig = getBabelConfig({
  styleSheet: true,
  custom: {
    ignore: ['**/**/*.d.ts']
  }
});

const JS_FILES_PATTERN = 'src/**/*.+(js|jsx)';
const OTHER_FILES_PATTERN = 'src/**/*.!(js|jsx|ts|tsx)';
const IGNORE_PATTERN = '**/__tests__/**';

module.exports = async({ context, log }, options = {}) => {
  const { rootDir, userConfig } = context;
  const { enableTypescript, targets = [] } = options;
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
        .pipe(babel(babelConfig))
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

  return new Promise((resolve, reject) => {
    runSequence(...tasks, async() => {
      // build miniapp
      if (~targets.indexOf('miniapp')) {
        fs.removeSync(path.join(BUILD_DIR, 'miniapp'));
        const mpErr = await mpBuild(context);

        if (mpErr) {
          resolve(mpErr);
        }
      }

      resolve();
    });
  });
};
