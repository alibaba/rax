'use strict';

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const webpackConfigBase = require('../../webapp/webpack.config.base');
const getEntries = require('../../../utils/getEntries');

const webpackConfig = webpackMerge(webpackConfigBase, {
  target: 'node',
  entry: getEntries(), // serverless loader
  output: {
    filename: 'serverless/[name].js',
    libraryTarget: 'commonjs2',
  }
});

module.exports = webpackConfig;
