'use strict';

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const babelConfig = require('../babel.config');
const pathConfig = require('../path.config');
const webpackConfigBase = require('./webpack.config.base');

const UNIVERSAL_APP_SHELL_LOADER = require.resolve('universal-app-shell-loader');

babelConfig.plugins.push(
  require.resolve('rax-hot-loader/babel')
);

// enable source map
const webpackConfigDev = webpackMerge(webpackConfigBase, {
  devtool: 'inline-module-source-map',
  entry: {
    'index.web': [UNIVERSAL_APP_SHELL_LOADER + '?type=web!' +pathConfig.miniProgramIndexJs],
    'index.weex':  [UNIVERSAL_APP_SHELL_LOADER + '?type=weex!' +pathConfig.miniProgramIndexJs],
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});

Object.keys(webpackConfigDev.entry).forEach((point) => {
  // hot reaload client.
  webpackConfigDev.entry[point].unshift(require.resolve('../../hmr/webpackHotDevClient.entry'));
});

module.exports = webpackConfigDev;
