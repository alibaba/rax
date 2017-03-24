'use strict';
/* eslint no-console: 0 */

process.on('unhandledRejection', err => {
  throw err;
});

process.env.NODE_ENV = 'development';

const colors = require('chalk');
const WebpackDevServer = require('webpack-dev-server');

const webpackDevServerConfig = require('../config/webpackDevServer.config');
const webpackConfigDev = require('../config/webpack.config.dev');
const createWebpackCompiler = require('../utils/createWebpackCompiler');

function run(port) {
  const compiler = createWebpackCompiler(webpackConfigDev);

  const server = new WebpackDevServer(compiler, webpackDevServerConfig);

  server.listen(port, err => {
    if (err) {
      return console.log(err);
    }

    console.log('');
    console.log(colors.cyan('Starting the development server...'));
    console.log('');
  });
}

const options = require('../utils/parseOptions');
run(options.port);
