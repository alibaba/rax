'use strict';

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const webpackConfigBase = require('./webpack.config.base');

// enable source map
const webpackConfigDev = webpackMerge(webpackConfigBase, {
  devtool: 'inline-module-source-map',
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});

// Object.keys(webpackConfigDev.entry).forEach((point) => {
//   // hot reaload client.
//   webpackConfigDev.entry[point].unshift(require.resolve('../../../hmr/webpackHotDevClient.entry'));
// });

module.exports = webpackConfigDev;
