const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const debug = require('gulp-debug');

module.exports = function (destDir, projectDir) {
  return () => {
    return gulp.src('**/*.{png,jpg,gif,ico,webp,jpeg}', {
      cwd: projectDir,
      dot: true,
      nodir: true,
    })
      .pipe(imagemin())
      .pipe(debug({
        title: 'Image Assets Collection'
      }))
      .pipe(gulp.dest(destDir));
  }
}
