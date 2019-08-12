const chalk = require('chalk');
const path = require('path');
const ts = require('gulp-typescript');
const babel = require('gulp-babel');
const fs = require('fs-extra');
const { getBabelConfig } = require('rax-compile-config');

const babelConfig = getBabelConfig();

const {
  JS_FILES_PATTERN,
  TS_FILES_PATTERN,
  OTHER_FILES_PATTERN,
  IGNORE_PATTERN,
} = require('./filePattern');

module.exports = (context, options, log, gulp) => {
  const { rootDir, userConfig } = context;
  const { enableTypescript } = options;
  const { outputDir } = userConfig;

  const BUILD_DIR = path.resolve(rootDir, outputDir);

  gulp.task('clean', function(done) {
    log.info('api', `Cleaning build directory ${BUILD_DIR}`);
    fs.removeSync(BUILD_DIR);
    log.info('api', 'Build directory has been Cleaned');
    done();
  });

  // for js/jsx.
  gulp.task('js', function() {
    log.info('api', 'Compiling javascript files');
    return gulp
      .src([JS_FILES_PATTERN], { ignore: IGNORE_PATTERN })
      .pipe(babel(babelConfig))
      .pipe(gulp.dest(BUILD_DIR))
      .on('end', () => {
        log.info('api', 'Javascript files have been compiled');
      });
  });

  if (enableTypescript) {
    const tsProject = ts.createProject('tsconfig.json', {
      skipLibCheck: true,
      declaration: true,
      declarationDir: BUILD_DIR
    });

    // for ts/tsx.
    gulp.task('ts', function() {
      log.info('api', 'Compiling typescript files');
      return tsProject.src().pipe(tsProject())
        .on('error', (err) => {
          log.error('api', 'Error while compiling typescript files');
          log.error(err);
          process.exit(1);
        })
        .pipe(gulp.dest(BUILD_DIR))
        .on('end', () => {
          log.info('api', 'Typescript files have been compiled');
        });
    });
  }

  // for other.
  gulp.task('copyOther', function() {
    log.info('api', 'Copy other files');
    return gulp
      .src([OTHER_FILES_PATTERN], { ignore: IGNORE_PATTERN })
      .pipe(gulp.dest(BUILD_DIR))
      .on('end', () => {
        log.info('api', 'Other Files have been copied');
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

  return tasks;
};
