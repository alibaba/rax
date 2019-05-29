'use strict';

const webpackMerge = require('webpack-merge');
const webpackConfigBase = require('../webpack.config.base');
const getEntries = require('../../../utils/getEntries');
const babelConfig = require('../../babel.config');
const pathConfig = require('../../../config/path.config');

const entries = getEntries();
entries._template = pathConfig.appTemplate;

const webpackConfig = webpackMerge(webpackConfigBase, {
  target: 'node',
  entry: entries,
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: babelConfig,
          },
          {
            loader: require.resolve('rax-webpack-plugin/lib/PlatformLoader'),
            options: {
              platform: 'node'
            }
          },
        ],
      }
    ]
  },
  output: {
    filename: 'server/[name].js',
    libraryTarget: 'commonjs2',
  },
  externals: {
    rax: 'rax',
  },
});

module.exports = webpackConfig;
