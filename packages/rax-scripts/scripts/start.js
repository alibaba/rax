'use strict';
/* eslint no-console: 0 */

process.on('unhandledRejection', err => {
  throw err;
});

process.env.NODE_ENV = 'development';

const colors = require('chalk');
const WebpackDevServer = require('webpack-dev-server');

const createWebpackCompiler = require('./utils/createWebpackCompiler');
const updateWebpackConfig = require('./utils/updateWebpackConfig');
const webpackConfigDev = require('./config/webpack.config.dev');
const webpackDevServerConfig = require('./config/webpackDevServer.config');

/**
 * run webpack dev server
 * @param  {Number} port server port
 */
function run(port) {
  const config = updateWebpackConfig(webpackConfigDev);
  const compiler = createWebpackCompiler(config);

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

const options = require('./utils/parseOptions');
run(options.port);
