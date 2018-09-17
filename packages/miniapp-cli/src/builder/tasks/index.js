const gulp = require('gulp');

/**
 * register all gulp tasks
 */
exports.registerGulpTasks = function({ appConfig, projectDir, destDir }) {
  // make sure build folder exists
  gulp.task('ensure-dir', require('./ensureDir')(destDir));

  // make sure build folder clean
  gulp.task('clean', require('./clean')(destDir));

  // entry of app build task
  gulp.task('build-app', require('./buildApp')(projectDir, destDir));

  // entry of config build task
  gulp.task('build-config', require('./buildConfig')(destDir, appConfig));

  // entry of web build task
  gulp.task('build-web', require('./buildWeb')(destDir, appConfig));

  // build schema for template miniapp
  gulp.task('build-schema', require('./buildSchema')(destDir, projectDir));

  // bundle zip file
  gulp.task('bundle', require('./bundle')(destDir));

  // collect static assets
  gulp.task('collect-assets', require('./collectAssets')(destDir, projectDir));
};