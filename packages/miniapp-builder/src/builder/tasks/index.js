const gulp = require('gulp');

/**
 * Register all gulp tasks
 */
exports.registerGulpTasks = function({ appConfig, projectDir, destDir }) {
  // Make sure build folder exists
  gulp.task('ensure-dir', require('./ensureDir')(destDir));

  // Make sure build folder clean
  gulp.task('clean', require('./clean')(destDir));

  // Entry of app build task
  gulp.task('build-app', require('./buildApp')(projectDir, destDir));

  // Entry of config build task
  gulp.task('build-config', require('./buildConfig')(destDir, appConfig));

  // Entry of web build task
  gulp.task('build-web', require('./buildWeb')(destDir, appConfig));

  // Build schema for template miniapp
  gulp.task('build-schema', require('./buildSchema')(destDir, projectDir));

  // Build page meta for template miniapp
  gulp.task('build-mod-meta', require('./buildModMeta')(destDir, projectDir));

  // Add `includeFiles` determated files to package.
  gulp.task('build-include-files', require('./buildIncludeFiles')(destDir, projectDir, appConfig));

  // Bundle zip file
  gulp.task('bundle', require('./bundle')(destDir));

  // collect static assets
  gulp.task('collect-assets', require('./collectAssets')(destDir, projectDir));
};
