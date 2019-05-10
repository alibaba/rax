'use strict';

/* eslint no-console: 0 */
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pathConfig = require('../path.config');
const webpackConfigBase = require('./webpack.config.base');

// enable source map
const webpackConfigDev = webpackMerge(webpackConfigBase, {
  devtool: 'inline-module-source-map',
  entry: {
    index: [pathConfig.componentDemoJs]
  },
  output: {
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: pathConfig.appHtml
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ]
});

Object.keys(webpackConfigDev.entry).forEach(point => {
  // hot reaload client.
  webpackConfigDev.entry[point].unshift(require.resolve('../../hmr/webpackHotDevClient.entry'));
});

module.exports = webpackConfigDev;
