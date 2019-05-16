'use strict';

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const webpackConfigBase = require('../../webapp/webpack.config.base');
const getEntries = require('../../../utils/getPWAEntries');

const webpackConfig = webpackMerge(webpackConfigBase, {
  target: 'web',
  entry: getEntries(), // client loader
  output: {
    filename: 'client/[name].js'
  }
});

module.exports = webpackConfig;
