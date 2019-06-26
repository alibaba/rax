'use strict';

const qs = require('querystring');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pathConfig = require('../../path.config');
const getWebpackConfigBase = require('../webpack.config.base');

const appConfig = require('../../app.config');
const { getEntries } = require('../../index');

const { RaxPWAPlugin } = require('rax-pwa-webpack-plugin');

const entryMap = {};
if (appConfig.ssr) {
  const entries = getEntries();
  Object.keys(entries).forEach((key) => {
    if (!appConfig.spa && key.indexOf('_') > -1) {
      return;
    }
    entryMap[key] = [entries[key]];
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
  plugins: appConfig.ssr || appConfig.spa ? [new RaxPWAPlugin({ pathConfig, appConfig })] : [
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
