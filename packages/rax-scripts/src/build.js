'use strict';
/* eslint no-console: 0 */
// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const colors = require('chalk');
const rimraf = require('rimraf');

const jsx2mp = require('jsx2mp');
const createWebpackCompiler = require('./utils/createWebpackCompiler');
const pathConfig = require('./config/path.config');
const compileComponent = require('./utils/componentCompiler');

const MINIAPP = 'miniapp';
const UNIVERSALAPP = 'universalapp';
const COMPONENT = 'component';
const webpackConfigMap = {
  webapp: './config/webapp/webpack.config.prod',
  weexapp: './config/weexapp/webpack.config.prod',
  component: './config/component/webpack.config.prod',
};

module.exports = function build(type = 'webapp') {
  const appPackage = require(pathConfig.appPackageJson);

  if (type === MINIAPP) {
    jsx2mp(pathConfig.appDirectory, pathConfig.appDist, false);
  } else if (type === COMPONENT) { // build component
    const webpackConfigComponentDistProd = require(webpackConfigMap.component);
    compileComponent(appPackage.name);
    cleanFolder(pathConfig.appDist)
      .then(() => buildCompiler(webpackConfigComponentDistProd))
      .then(handleBuildSuccess)
      .catch(handleBuildError);
  } else if (type === UNIVERSALAPP) {
    cleanFolder(pathConfig.appBuild)
      .then(() => {
        const buildMiniApp = () => jsx2mp(pathConfig.appDirectory, 'dist-miniapp', false);
        const tasks = ['webapp', 'weexapp']
          .map((type) => {
            const config = require(webpackConfigMap[type]);
            config.output.path = 'dist-' + type;
            const compiler = createWebpackCompiler(config);
            return buildCompiler(compiler);
          })
          .concat(buildMiniApp);
        return Promise.all(tasks);
      })
      .then(handleBuildSuccess)
      .catch(handleBuildError);
  } else {
    cleanFolder(pathConfig.appBuild)
      .then(() => {
        const config = require(webpackConfigMap[type]);
        return buildCompiler(config);
      })
      .then(handleBuildSuccess)
      .catch(handleBuildError);
  }
};

function buildCompiler(config) {
  const compiler = createWebpackCompiler(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      } else if (stats.hasError()) {
        const err = new Error('Build with error.');
        err.stats = stats;
        reject(err);
      } else {
        resolve(stats);
      }
    });
  });
}

function cleanFolder(path) {
  return new Promise((resolve, reject) => {
    rimraf(path, function(err) {
      if (err) reject(err)
      else resolve();
    });
  });
}

function handleBuildSuccess(stats) {
  console.log(stats.toString({
    colors: true,
  }));
  console.log(colors.green('\nBuild successfully.'));
  process.exit();
}

function handleBuildError(err) {
  if (err.stats) {
    err.stats.toString({ colors: true })
  }
  console.log(colors.green('\nBuild with error.'));
  process.exit(1);
}
