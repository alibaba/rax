const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const debug = require('gulp-debug');

module.exports = function(destDir, projectDir) {
  return () => {
    return gulp.src('**/*.{apng,png,jpg,gif,ico,webp,jpeg,svg}', {
      cwd: projectDir,
      dot: true,
      nodir: true,
      ignore: ['**/node_modules/**', '**/build/**'],
    })
      .pipe(imagemin())
      .pipe(debug({
        title: 'Image Assets Collection'
      }))
      .pipe(gulp.dest(destDir));
  };
};
