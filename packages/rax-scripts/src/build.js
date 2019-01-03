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

const createWebpackCompiler = require('./utils/createWebpackCompiler');
var componentCompiler = require('./utils/componentCompiler');
const pathConfig = require('./config/path.config');

function buildCompiler(config) {
  const compiler = createWebpackCompiler(config);

  compiler.run((err) => {
    if (err) {
      throw err;
    }

    console.log(colors.green('\nBuild successfully.'));
  });
}

const webpackConfigMap = {
  webapp: './config/webapp/webpack.config.prod',
  miniapp: './config/miniapp/webpack.config.prod',
  component: './config/component/webpack.config.prod',
};

module.exports = function build(type = 'webapp') {
  const appPackage = require(pathConfig.appPackageJson);

  if (appPackage.keywords.indexOf('rax-component')) { // build component
    var webpackConfigComponentDistProd = require(webpackConfigMap.component);
    componentCompiler(appPackage.name);
    rimraf(pathConfig.appDist, function(err) {
      if (err) {
        throw err;
      }
      buildCompiler(webpackConfigComponentDistProd);
    });
  } else {
    rimraf(pathConfig.appBuild, (err) => {
      if (err) {
        throw err;
      }
      const config = require(webpackConfigMap[type]);
      buildCompiler(config);
    });
  }
};
