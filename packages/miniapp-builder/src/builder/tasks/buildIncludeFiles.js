const gulp = require('gulp');
const debug = require('gulp-debug');

const INCLUDE_FILES = 'includeFiles';

/**
 * Add `includeFiles` determated files to package.
 */
module.exports = function(destDir, projectDir, appConfig) {
  return () => {
    if (appConfig && INCLUDE_FILES in appConfig) {
      return gulp
        .src(appConfig[INCLUDE_FILES], {
          base: projectDir,
          nodir: true,
          dot: true,
        })
        .pipe(debug({
          title: 'Copy include files.'
        }))
        .pipe(gulp.dest(destDir));
    } else {
      return Promise.resolve();
    }
  };
};
