'use strict';

const qs = require('querystring');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pathConfig = require('../../path.config');
const babelConfigBase = require('../../babel.config');
const webpackConfigBase = require('../webpack.config.base');
const getEntries = require('../../../utils/getEntries');
const getAppConfig = require('../../../utils/getAppConfig');

const ClientLoader = require.resolve('rax-ssr-webpack-plugin/lib/ClientLoader');

const appConfig = getAppConfig() || {};
const entries = getEntries();
const entry = {};
if (appConfig.ssr) {
  Object.keys(entries).forEach((key) => {
    entry[key] = [`${ClientLoader}?${qs.stringify({ ssr: true })}!${entries[key]}`];
  });
} else {
  entry.index = [pathConfig.appIndexJs];
}

const babelConfig = {...babelConfigBase};
babelConfig.plugins.push(
  require.resolve('rax-hot-loader/babel')
);

const webpackConfig = webpackMerge(webpackConfigBase, {
  target: 'web',
  entry: entry,
  output: {
    filename: 'client/[name].js'
  },
  plugins: appConfig.ssr ? [] : [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: pathConfig.appHtml,
    }),
  ],
  resolve: {
    alias: {
      'rax-hydrate': require.resolve('rax-hydrate')
    }
  },
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
              platform: 'web'
            }
          },
        ],
      }
    ]
  }
});

module.exports = webpackConfig;
