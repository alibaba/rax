'use strict';

const path = require('path');
const address = require('address');

const hmrClient = require.resolve('../../hmr/webpackHotDevClient.entry');
const UNIVERSAL_APP_SHELL_LOADER = require.resolve('universal-app-shell-loader');

module.exports = (config, context) => {
  const { rootDir, userConfig } = context;
  const { publicPath } = userConfig;

  const appEntry = path.resolve(rootDir, 'src/app.js');

  config.mode('development');
  config.devtool('inline-module-source-map');

  config.entry('index')
    .add(hmrClient)
    .add(`${UNIVERSAL_APP_SHELL_LOADER}?type=web!${appEntry}`);

  config.devServer
    .compress(true)
    .clientLogLevel('error')
    .contentBase(path.resolve(rootDir, 'build'))
    .watchContentBase(true)
    .hot(true)
    .quiet(true)
    .publicPath(publicPath)
    .overlay(false)
    .host(address.ip())
    .public(address.ip());
};
