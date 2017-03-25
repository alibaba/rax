'use strict';

const webpackConfig = require('./webpack.config');
const webpack = require('webpack');

// enable source map
webpackConfig.devtool = 'inline-module-source-map';

// show webpakc build progress
webpackConfig.plugins.push(
  new webpack.ProgressPlugin(function(percentage, msg) {
    const stream = process.stderr;
    if (stream.isTTY && percentage < 0.71) {
      stream.cursorTo(0);
      stream.write('  ' + msg + '...');
      stream.clearLine(1);
    } else if (percentage === 1) {
      console.log('');
      console.log('webpack: bundle build is now finished.');
    }
  })
);

// enable entry point module hot accept.
const client = require.resolve('webpack-dev-server/client');
const onlyDevServer = require.resolve('webpack/hot/only-dev-server');
const options = require('../utils/parseOptions');

Object.keys(webpackConfig.entry).forEach(point => {
  webpackConfig.entry[point].unshift(`${onlyDevServer}`);
  webpackConfig.entry[point].unshift(
    `${client}?${options.protocol}//${options.host}:${options.port}/`
  );
});

webpackConfig.module.loaders.forEach(loader => {
  if (loader.test.toString() === /\.jsx?$/.toString()) {
    loader.loaders.push(require.resolve('../loaders/module-hot-accept'));
  }
});

webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

module.exports = webpackConfig;
