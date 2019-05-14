'use strict';

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const webpackConfigBase = require('../../webapp/webpack.config.base');
const getEntries = require('../../../utils/getEntries');

const webpackConfig = webpackMerge(webpackConfigBase, {
  target: 'node',
  entry: getEntries(),
  output: {
    filename: 'server/[name].js',
  },
  externals: {
    rax: 'rax',
  },
});

module.exports = webpackConfig;
