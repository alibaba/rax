const babel = require('gulp-babel');
const gulp = require('gulp');
const path = require('path');
const rimraf = require('rimraf');
const source = require('vinyl-source-stream');
const vinylBuffer = require('vinyl-buffer');
const babelConfig = require('./babel.config');

const cwd = process.cwd();
const FILES_PATTERN = `${cwd}/+(src|demo)/miniapp/**/*`;
const dist = path.resolve(cwd, './_miniapp');
const extTypes = ['ts', 'json', 'axml'];

babelConfig.presets.unshift(require.resolve('@babel/preset-typescript'));

gulp.task('clean', function(done) {
  rimraf(dist, done);
});

gulp.task('ts', () => {
  return gulp
    .src(`${FILES_PATTERN}.ts`)
    .pipe(babel(babelConfig))
    .pipe(gulp.dest(dist));
});

gulp.task('json', () => {
  return gulp.src(`${FILES_PATTERN}.json`).pipe(gulp.dest(dist));
});

gulp.task('axml', () => {
  return gulp.src(`${FILES_PATTERN}.axml`).pipe(gulp.dest(dist));
});

gulp.task('app.js', () => {
  const stream = source('app.js');
  stream.write(`
App({
  onLaunch() {},
  onShow() {},
  onHide() {},
});
  `);
  process.nextTick(function() {
    stream.end();
  });
  return stream.pipe(vinylBuffer()).pipe(gulp.dest(dist));
});

gulp.task('app.acss', () => {
  const stream = source('app.acss');
  stream.write('');
  process.nextTick(function() {
    stream.end();
  });
  return stream.pipe(vinylBuffer()).pipe(gulp.dest(dist));
});

gulp.task('app.json', () => {
  const stream = source('app.json');
  stream.write(`
{
  "pages": [
    "demo/miniapp/index"
  ],
  "window": {
    "enableWK": "YES",
    "enableDSL": "YES",
    "enableJSC": "YES",
    "defaultTitle": "demo",
    "backgroundColor": "#F5F5F9",
    "pullRefresh": false,
    "allowsBounceVertical": true
  },
  "debug": true
}
  `);
  process.nextTick(function() {
    stream.end();
  });
  return stream.pipe(vinylBuffer()).pipe(gulp.dest(dist));
});

gulp.task('app file', gulp.parallel('app.js', 'app.json', 'app.acss'));

gulp.task('watch', () => {
  extTypes.forEach(type => {
    gulp.watch([`${FILES_PATTERN}.${type}`], gulp.parallel(type));
  });
});

gulp.task(
  'default',
  gulp.series(
    'clean',
    gulp.parallel('ts', 'json', 'axml', 'app file'),
    gulp.series('watch')
  )
);
