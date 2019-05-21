'use strict';

const webpackMerge = require('webpack-merge');
const webpackConfigBase = require('./webpack.config.base');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const webpackConfigProd = webpackMerge(webpackConfigBase, {
  devtool: 'source-map',
  optimization: {
    minimize: false
  },
});

module.exports = webpackConfigProd;
