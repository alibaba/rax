'use strict';
const webpackMerge = require('webpack-merge');
const getWebpackConfigBase = require('../webpack.config.base');

const { getEntries } = require('../../index');

const entries = getEntries();

const webpackConfigBase = getWebpackConfigBase({
  target: 'node'
});

const webpackConfig = webpackMerge(webpackConfigBase, {
  entry: entries,
  output: {
    filename: 'server/[name].js',
    libraryTarget: 'commonjs2',
  },
  externals: {
    rax: 'rax',
  },
});

module.exports = webpackConfig;
