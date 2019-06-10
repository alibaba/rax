'use strict';

const qs = require('querystring');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pathConfig = require('../../path.config');
const getWebpackConfigBase = require('../webpack.config.base');
const getEntries = require('../../../utils/getEntries');
const getAppConfig = require('../../../utils/getAppConfig');

const ClientLoader = require.resolve('rax-pwa-webpack-plugin/lib/ClientLoader');

const appConfig = getAppConfig() || {};

const entryMap = {};
if (appConfig.ssr) {
  const entries = getEntries();
  Object.keys(entries).forEach((key) => {
    if (key.indexOf('_') > -1) {
      return;
    }
    entryMap[key] = [`${ClientLoader}?${qs.stringify({ ssr: true })}!${entries[key]}`];
  });
} else {
  entryMap.index = [pathConfig.appIndexJs];
}

const webpackConfigBase = getWebpackConfigBase({
  target: 'web'
});

const webpackConfig = webpackMerge(webpackConfigBase, {
  target: 'web',
  entry: entryMap,
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
  }
});

module.exports = webpackConfig;
