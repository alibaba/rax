'use strict';

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpackConfig = require('../webpack.config');

module.exports = {
  mode: webpackConfig.mode,
  context: webpackConfig.context,
  // Compile target should "web" when use hot reload
  target: webpackConfig.target,
  entry: webpackConfig.entry,
  output: Object.assign({}, webpackConfig.output, {
    filename: '[name].js',
  }),
  resolve: webpackConfig.resolve,

  plugins: [
    webpackConfig.plugins.define,
    webpackConfig.plugins.caseSensitivePaths,
    process.env.ANALYZER ? new BundleAnalyzerPlugin() : null,
  ].filter(Boolean),
};
