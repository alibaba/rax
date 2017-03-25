'use strict';

const webpackConfig = require('./webpack.config.prod');
const webpack = require('webpack');
const colors = require('chalk');

// enable source map
webpackConfig.devtool = 'inline-module-source-map';

// show webpakc build progress
webpackConfig.plugins.push(
  new webpack.ProgressPlugin(function(percentage, msg) {
    const stream = process.stderr;
    if (stream.isTTY && percentage < 0.71) {
      stream.cursorTo(0);
      stream.write(`webpack: ${msg}...`);
      stream.clearLine(1);
    } else if (percentage === 1) {
      console.log('');
      console.log(colors.green('webpack: bundle build is now finished.'));
    }
  })
);

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
