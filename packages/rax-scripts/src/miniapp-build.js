/* eslint no-console: 0 */
const { existsSync, writeFileSync, readFileSync } = require('fs');
const { join } = require('path');
const colors = require('chalk');
const debug = require('gulp-debug');
const ejs = require('ejs');
const fs = require('fs');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const mkdirp = require('mkdirp');
const runSequence = require('run-sequence');
const zip = require('gulp-zip');

const {
  getMiniappType,
  goldlog,
  getAppConfig,
  masterTemplateFilePath,
} = require('miniapp-compiler-shared');

const projectDir = process.cwd();
const miniappType = getMiniappType(projectDir);

function copy(from, to) {
  writeFileSync(to, readFileSync(from));
}

// fire a glodlog record
goldlog('taobao-developers.build.cloud-build-dist', {
  // eslint-disable-next-line camelcase
  miniapp_type: miniappType,
});
if (!miniappType) {
  console.log(colors.red('ERR. 请检查是否在淘宝无线应用项目中.'));
  process.exit(1);
} else {
  const TYPE = { sfc: '轻框架语法', mp: '小程序语法' };
  console.log(colors.green(`检测到 ${TYPE[miniappType]} 类型项目.`));
}
const { BUILD_DEST = 'build' } = process.env;
const appConfig = getAppConfig(projectDir);
const destDir = join(projectDir, BUILD_DEST || '');

gulp.task('ensure-dir', require('./tasks/ensureDir')(destDir));
gulp.task('clean', require('./tasks/clean')(destDir));
gulp.task('build', require('./tasks/build')(projectDir, destDir));

gulp.task(
  'generate-app-config',
  require('./tasks/generateAppConfig')(destDir, appConfig),
);

gulp.task('bundle', () =>
  gulp
    .src(['**', '!app.web.js', '!index.html'], {
      cwd: destDir,
      dot: true,
      nodir: true,
    })
    .pipe(zip('bundle.zip'))
    .pipe(gulp.dest(destDir)),
);
gulp.task('html', (done) => {
  appConfig.h5Assets = '/app.web.js';
  ejs.renderFile(
    masterTemplateFilePath,
    {
      appConfig: JSON.stringify(appConfig, null, 2),
      h5MasterJS:
        'https://g-assets.daily.taobao.net/miniapp/framework/0.0.15/h5/master.js',
    },
    {},
    (error, htmlContent) => {
      if (error) {
        done(error);
      } else {
        fs.writeFileSync(join(destDir, 'index.html'), htmlContent);
        done();
      }
    },
  );
});

gulp.task('collect-assets', () => {
  return gulp
    .src(['**/*.{png,jpg,gif,ico,webp,jpeg}', '!node_modules/**'], {
      cwd: projectDir,
      dot: true,
      nodir: true,
    })
    .pipe(imagemin())
    .pipe(debug({ title: 'ASSETS Collection' }))
    .pipe(gulp.dest(destDir));
});
gulp.task('build-schema', (done) => {
  mkdirp.sync(join(destDir, '.schema'));
  const appConfigJSONPath = join(destDir, 'app.config.json');
  copy(appConfigJSONPath, join(destDir, '.schema/app.config.json'));
  const schemaPath = join(projectDir, 'schema', 'data.json');
  if (existsSync(schemaPath)) {
    copy(schemaPath, join(destDir, '.schema/schema.json'));
  }
  const mockPath = join(projectDir, 'mock', 'data.json');
  if (existsSync(mockPath)) {
    copy(mockPath, join(destDir, '.schema/mock-data.json'));
  }
  done();
});
gulp.task('default', () => {
  runSequence(
    'clean',
    'ensure-dir',
    ['generate-app-config', 'build', 'collect-assets'],
    'build-schema',
    'bundle',
    'html',
  );
});
