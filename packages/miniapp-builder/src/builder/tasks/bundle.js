const gulp = require('gulp');
const zip = require('gulp-zip');

module.exports = function(destDir) {
  return () => gulp.src('**', {
    cwd: destDir,
    dot: true,
    nodir: true,
  })
    .pipe(zip('bundle.zip'))
    .pipe(gulp.dest(destDir));
};
