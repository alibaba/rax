'use strict';
/* eslint no-console: 0 */
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const webpackConfigBase = require('./webpack.config.base');
const pathConfig = require('../path.config');

const webpackConfigDev = webpackMerge(webpackConfigBase, {
  devtool: 'cheap-eval-source-map',
  entry: {
    index: [pathConfig.miniProgramIndexJs]
  },
  output: {
    // show at devtool console panel
    devtoolModuleFilenameTemplate: 'webpack://[namespace]/[resource-path]',
    devtoolNamespace: 'miniapp',
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    process.env.ANALYZER ? new BundleAnalyzerPlugin() : null,
  ].filter(Boolean),
});

module.exports = webpackConfigDev;
