'use strict';

const path = require('path');
const fs = require('fs');
const optionConfig = require('./option.config');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(optionConfig.dir);

function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

const nodePaths = (process.env.NODE_PATH || '')
  .split(process.platform === 'win32' ? ';' : ':')
  .filter(Boolean)
  .map(resolveApp);

const moduleFileExtensions = [
  'mjs',
  'js',
  'ts',
  'tsx',
  'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

const paths = {
  appDirectory: appDirectory,
  appBuild: resolveApp('build'),
  appDist: resolveApp('dist'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveModule(resolveApp, 'src/index'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appManifest: resolveApp('manifest.json'),
  appNodeModules: resolveApp('node_modules'),
  nodePaths: nodePaths,
  miniProgramIndexJs: resolveModule(resolveApp, 'app'),
};

module.exports = paths;
