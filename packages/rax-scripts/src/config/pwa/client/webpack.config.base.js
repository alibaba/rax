'use strict';

const qs = require('querystring');
const webpackMerge = require('webpack-merge');

const webpackConfigBase = require('../webpack.config.base');
const getEntries = require('../../../utils/getPWAEntries');

const ClientLoader = require.resolve('rax-ssr-webpack-plugin/lib/ClientLoader');

const entries = getEntries();
Object.keys(entries).forEach((key) => {
  // TODO: read config file set ssr value
  entries[key] = `${ClientLoader}?${qs.stringify({ ssr: true })}!${entries[key]}`;
});

const webpackConfig = webpackMerge(webpackConfigBase, {
  target: 'web',
  entry: entries,
  output: {
    filename: 'client/[name].js'
  },
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
              platform: 'web'
            }
          },
        ],
      }
    ]
  }
});

module.exports = webpackConfig;
