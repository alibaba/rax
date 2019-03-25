'use strict';

const pathConfig = require('../path.config');
const webpackMerge = require('webpack-merge');
const webpackConfigBase = require('./webpack.config.base');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const webpackConfigProd = webpackMerge(webpackConfigBase, {
  target: 'node',
  devtool: 'source-map',
  entry: {
    'index.min': [pathConfig.appIndexJs],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJSPlugin({
        include: /\.min\.js$/,
        cache: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({
        // A boolean indicating if the plugin can print messages to the console
        canPrint: true
      })
    ]
  },
});

module.exports = webpackConfigProd;
