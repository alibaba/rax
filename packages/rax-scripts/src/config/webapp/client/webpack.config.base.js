'use strict';

const fs = require('fs');
const qs = require('querystring');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AssetsManifestPlugin = require('rax-pwa-webpack-plugin/lib/AssetsManifestPlugin').default;
const getWebpackConfigBase = require('../webpack.config.base');
const pathConfig = require('../../path.config');

const appConfig = require('../../app.config');
const envConfig = require('../../env.config');
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

if (!fs.existsSync(pathConfig.tempDirectory)) {
  fs.mkdirSync(pathConfig.tempDirectory);
}

let webpackPlugins = [];

if (appConfig.spa) {
  webpackPlugins = [new RaxPWAPlugin({ pathConfig, appConfig })];
}

if (appConfig.ssr) {
  webpackPlugins = [
    new RaxPWAPlugin({ pathConfig, appConfig }),
    new AssetsManifestPlugin({
      dist: pathConfig.assetsManifest,
      publicPath: envConfig.publicPath
    })];
}

if (webpackPlugins.length === 0) {
  webpackPlugins = [
    new HtmlWebpackPlugin({
      inject: true,
      template: pathConfig.appHtml,
    })
  ];
}

const webpackConfig = webpackMerge(webpackConfigBase, {
  target: 'web',
  entry: entryMap,
  output: {
    filename: 'client/[name].js'
  },
  plugins: webpackPlugins,
  resolve: {
    alias: {
      'rax-hydrate': require.resolve('rax-hydrate')
    }
  }
});

module.exports = webpackConfig;
