'use strict';

const webpackMerge = require('webpack-merge');
const webpackConfigBase = require('../webpack.config.base');
const getEntries = require('../../../utils/getPWAEntries');

const webpackConfig = webpackMerge(webpackConfigBase, {
  target: 'node',
  entry: getEntries(),
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        enforce: 'pre',
        use: [
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
