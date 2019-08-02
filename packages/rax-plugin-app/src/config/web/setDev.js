'use strict';

const path = require('path');
const address = require('address');

const hmrClient = require.resolve('../../hmr/webpackHotDevClient.entry');
const UNIVERSAL_APP_SHELL_LOADER = require.resolve('universal-app-shell-loader');

module.exports = (config, rootDir) => {
  const appEntry = path.resolve(rootDir, 'src/app.js');

  config.mode('development');
  config.devtool('inline-module-source-map');

  config.entry('index')
    .add(hmrClient)
    .add(`${UNIVERSAL_APP_SHELL_LOADER}?type=web!${appEntry}`);

  const publicPath = '/';

  config.devServer
    .compress(true)
    .clientLogLevel('error')
    .contentBase(path.resolve(rootDir, 'build'))
    .watchContentBase(true)
    .hot(true)
    .publicPath(publicPath)
    .overlay(false)
    .host(address.ip())
    .public(address.ip());
};
