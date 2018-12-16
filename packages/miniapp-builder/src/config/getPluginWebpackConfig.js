const { resolve } = require('path');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpackBaseConfig');
const apiLoader = require.resolve('mp-loader/src/plugins/api-loader');

module.exports = function(pluginProjectDir) {
  const pluginConfig = {
    entry: {
      index: apiLoader + '!' + 'index.js',
    },
    mode: process.env.NODE_ENV || 'development',
    context: pluginProjectDir,
    module: {
      rules: [],
    },
  };

  return merge(
    webpackBaseConfig,
    pluginConfig
  );
}
