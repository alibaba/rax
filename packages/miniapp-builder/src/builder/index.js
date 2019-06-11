const gulp = require('gulp');
const runSequence = require('run-sequence').use(gulp);
const { join } = require('path');
const { getAppConfig } = require('../config/getAppConfig');
const getMiniappType = require('../config/getMiniappType');
const { registerGulpTasks } = require('./tasks');

const { BUILD_DEST } = process.env;

module.exports = function(opts) {
  const { projectDir } = opts;
  const miniappType = getMiniappType(projectDir);
  if (miniappType === 'plugin') {
    return buildMiniAppPlugin(projectDir);
  } else {
    return buildMiniApp(projectDir);
  }
};

function buildMiniApp(projectDir) {
  registerGulpTasks({
    projectDir,
    destDir: join(projectDir, BUILD_DEST || 'build'),
    appConfig: getAppConfig(projectDir),
  });

  runSequence(
    'clean',
    'ensure-dir',
    [
      'build-config',
      'build-app',
      'build-schema',
      'build-module',
      'collect-assets',
      'build-include-files',
    ],
    'bundle',
    'build-web',
  );
}

function buildMiniAppPlugin(projectDir) {
  registerGulpTasks({
    projectDir,
    destDir: join(projectDir, BUILD_DEST || 'build'),
  });

  runSequence(
    'clean',
    'ensure-dir',
    [
      'build-plugin',
      'collect-assets',
    ],
    'bundle-plugin',
  );
}
