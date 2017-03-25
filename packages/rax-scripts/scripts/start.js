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
const openBrowser = require('react-dev-utils/openBrowser');
const options = require('./utils/parseOptions');

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
    
    const serverUrl = `${options.protocol}//${options.host}:${options.port}/`;
    console.log('');
    console.log('');
    console.log(colors.green('Starting the development server at:'));
    console.log(`  ${colors.underline.white(serverUrl)}`);
    console.log('');
    
    openBrowser(serverUrl);
  });
}

run(options.port);
