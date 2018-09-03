'use strict';
/* eslint no-console: 0 */
process.env.NODE_ENV = 'development';

process.on('unhandledRejection', (err) => {
  throw err;
});

const colors = require('chalk');
const WebpackDevServer = require('webpack-dev-server');

const createWebpackCompiler = require('./utils/createWebpackCompiler');
const webpackConfigDev = require('./config/webpack.config.dev');
const webpackDevServerConfig = require('./config/webpackDevServer.config');
const envConfig = require('./config/env.config');

/**
 * run webpack dev server
 */
module.exports = function start() {
  const compiler = createWebpackCompiler(webpackConfigDev);

  const server = new WebpackDevServer(compiler, webpackDevServerConfig);

  server.listen(envConfig.port, envConfig.hostname, (err) => {
    if (err) {
      console.log(colors.red('[ERR]: Failed to webpack dev server'));
      console.error(err.message || err);
      process.exit(1);
    }

    const serverUrl = `${envConfig.protocol}//${envConfig.host}:${
      envConfig.port
    }/`;
    console.log('');
    console.log('');
    console.log(colors.green('Starting the development server at:'));
    console.log(`    ${colors.underline.white(serverUrl)}`);
    console.log('');
  });
};
