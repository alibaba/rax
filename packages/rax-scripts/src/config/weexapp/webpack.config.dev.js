'use strict';

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const babelConfig = require('../babel.config');
const pathConfig = require('../path.config');
const webpackConfigBase = require('./webpack.config.base');

babelConfig.plugins.push(
  require.resolve('rax-hot-loader/babel')
);

// enable source map
const webpackConfigDev = webpackMerge(webpackConfigBase, {
  devtool: 'inline-module-source-map',
  entry: {
    index: [pathConfig.appIndexJs],
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
