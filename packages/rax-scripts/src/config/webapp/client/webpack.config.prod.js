'use strict';

const webpackMerge = require('webpack-merge');
const webpackConfigBase = require('./webpack.config.base');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const webpackConfigProd = webpackMerge(webpackConfigBase, {
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJSPlugin({
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
