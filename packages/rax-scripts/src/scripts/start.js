'use strict';
/* eslint no-console: 0 */
process.env.NODE_ENV = 'development';

process.on('unhandledRejection', err => {
  throw err;
});

const colors = require('chalk');
const WebpackDevServer = require('webpack-dev-server');

const createWebpackCompiler = require('./utils/create-webpack-compiler');
const webpackConfigDev = require('./config/webpack.config.dev');
const webpackDevServerConfig = require('./config/webpackDevServer.config');
const options = require('./utils/parse-options');

/**
 * run webpack dev server
 * @param  {Number} port server port
 */
function start(port) {
  const compiler = createWebpackCompiler(webpackConfigDev);

  const server = new WebpackDevServer(compiler, webpackDevServerConfig);

  server.listen(port, err => {
    if (err) {
      console.log(colors.red('[ERR]: Failed to webpack dev server'));
      console.error(err.message || err);
      process.exit(1);
    }

    const serverUrl = `${options.protocol}//${options.host}:${options.port}/`;
    console.log('');
    console.log('');
    console.log(colors.green('Starting the development server at:'));
    console.log(`    ${colors.underline.white(serverUrl)}`);
    console.log('');
  });
}

start(options.port);
