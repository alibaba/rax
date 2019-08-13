'use strict';

const path = require('path');
const address = require('address');

const hmrClient = require.resolve('../../hmr/webpackHotDevClient.entry');
const UNIVERSAL_APP_SHELL_LOADER = require.resolve('universal-app-shell-loader');
const babelMerge = require('babel-merge');

module.exports = (config, context) => {
  const { rootDir, userConfig } = context;
  const { devPublicPath } = userConfig;

  const appEntry = path.resolve(rootDir, 'src/app.js');

  config.mode('development');
  config.devtool('inline-module-source-map');

  config.module.rule('jsx')
    .use('babel')
      .tap(options => babelMerge.all([{
        plugins: [require.resolve('rax-hot-loader/babel')],
      }, options]));

  config.module.rule('tsx')
    .use('babel')
      .tap(options => babelMerge.all([{
        plugins: [require.resolve('rax-hot-loader/babel')],
      }, options]));

  config.entry('index')
    .add(hmrClient)
    .add(`${UNIVERSAL_APP_SHELL_LOADER}?type=weex!${appEntry}`);

  config.devServer
    .compress(true)
    .clientLogLevel('error')
    .contentBase(path.resolve(rootDir, 'build'))
    .watchContentBase(true)
    .hot(true)
    .quiet(true)
    .publicPath(devPublicPath)
    .overlay(false)
    .host(address.ip())
    .public(address.ip());
};
