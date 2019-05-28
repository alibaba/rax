'use strict';
/* eslint no-console: 0 */
// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const colors = require('chalk');
const jsx2mp = require('jsx2mp');
const WebpackDevServer = require('webpack-dev-server');
const path = require('path');

const createWebpackCompiler = require('./utils/createWebpackCompiler');
const webpackDevServerConfig = require('./config/webpackDevServer.config');
const envConfig = require('./config/env.config');
const pathConfig = require('./config/path.config');

const MINIAPP = 'miniapp';
const COMPONENT_MINIAPP = 'component-miniapp';
const webpackConfigMap = {
  webapp: './config/webapp/webpack.config.dev',
  weexapp: './config/weexapp/webpack.config.dev',
  component: './config/component/webpack.config.dev'
};

/**
 * run webpack dev server
 */
module.exports = function start(type = 'webapp') {
  if (type === MINIAPP) {
    jsx2mp(pathConfig.appDirectory, pathConfig.appDist, true);
  } else if (type === COMPONENT_MINIAPP) {
    process.argv.push('--gulpfile', path.resolve(__dirname, './config/component/gulpfile-miniapp.js'));
    process.argv.push('--cwd', process.cwd());
    require('gulp-cli')();
  } else {
    const config = require(webpackConfigMap[type]);
    const compiler = createWebpackCompiler(config);

    const devServer = new WebpackDevServer(compiler, webpackDevServerConfig);

    // Launch WebpackDevServer.
    devServer.listen(envConfig.port, envConfig.hostname, err => {
      if (err) {
        console.log(colors.red('[ERR]: Failed to webpack dev server'));
        console.error(err.message || err);
        process.exit(1);
      }

      const serverUrl = `${envConfig.protocol}//${envConfig.host}:${envConfig.port}/`;

      console.log('');
      console.log(colors.green('Starting the development server at:'));
      console.log(`    ${colors.underline.white(serverUrl)}`);
      console.log('');

      ['SIGINT', 'SIGTERM'].forEach(function(sig) {
        process.on(sig, function() {
          devServer.close();
          process.exit();
        });
      });
    });
  }
};
