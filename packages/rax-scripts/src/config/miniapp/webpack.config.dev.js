'use strict';
/* eslint no-console: 0 */
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const webpackConfigBase = require('./webpack.config.base');
const pathConfig = require('../path.config');

const webpackConfigDev = webpackMerge(webpackConfigBase, {
  devtool: 'inline-source-map',
  entry: {
    index: [pathConfig.appManifest],
  },
  output: {
    publicPath: '/',
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
