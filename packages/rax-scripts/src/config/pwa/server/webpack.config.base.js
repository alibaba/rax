'use strict';

const webpackMerge = require('webpack-merge');
const webpackConfigBase = require('../webpack.config.base');
const getEntries = require('../../../utils/getPWAEntries');

const webpackConfig = webpackMerge(webpackConfigBase, {
  target: 'node',
  entry: getEntries(),
  output: {
    filename: 'server/[name].js',
    libraryTarget: 'commonjs2',
  },
  externals: {
    rax: 'rax',
  },
});

module.exports = webpackConfig;
