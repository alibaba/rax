'use strict';

const webpackConfig = require('./webpack.config.prod');
const webpack = require('webpack');

// enable source map
webpackConfig.devtool = 'inline-module-source-map';

// enable entry point module hot accept.
const webpackHotDevClient = require.resolve('react-dev-utils/webpackHotDevClient');

Object.keys(webpackConfig.entry).forEach(point => {
  webpackConfig.entry[point].unshift(webpackHotDevClient);
});

webpackConfig.module.loaders.forEach(loader => {
  if (loader.test.toString() === /\.jsx?$/.toString()) {
    loader.loaders.push(require.resolve('../loaders/module-hot-accept'));
  }
});

webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

module.exports = webpackConfig;
