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
const pathConfig = require('./config/path.config');
const componentCompiler = require('./utils/componentCompiler');
const jsx2mp = require('jsx2mp');

const { getWebpackConfig } = require('./config/');

function buildCompiler(config) {
  const compiler = createWebpackCompiler(config);

  compiler.run((err) => {
    if (err) {
      throw err;
    }

    console.log(colors.green('\nBuild successfully.'));
    process.exit();
  });
}

const MINIAPP = 'miniapp';
const COMPONENT = 'component';

module.exports = function build(type = 'webapp') {
  if (type === MINIAPP) {
    jsx2mp(pathConfig.appDirectory, pathConfig.appDist, {
      enableWatch: false,
      type: 'project',
      dist: 'dist',
      entry: pathConfig.universalAppEntry,
    });
  } else if (type === COMPONENT) { // build component
    rimraf(pathConfig.appDist, function(err) {
      if (err) {
        throw err;
      }
      componentCompiler();
    });
  } else {
    rimraf(pathConfig.appBuild, (err) => {
      if (err) {
        throw err;
      }
      const config = getWebpackConfig(type);
      buildCompiler(config);
    });
  }
};
