'use strict';

/* eslint no-console: 0 */
const address = require('address');
const qrcode = require('qrcode-terminal');
const webpack = require('webpack');
const paths = require('./paths');
const webpackConfigBase = require('./webpack.config.base');
const options = require('../utils/parse-options');
const RaxHotModuleReplacementPlugin = require('rax-hot-module-replacement-webpack-plugin');

const webpackConfigDev = Object.assign({}, webpackConfigBase);
const ipv4 = address.ip();
const port = options.port;
const webUrl = 'http://' + ipv4 + ':' + port;
const bundleUrl = 'http://' + ipv4 + ':' + port + '/js/index.bundle.js';
const weexBundleUrl = `${bundleUrl}?_wx_tpl=${bundleUrl}`;

qrcode.generate(webUrl, { small: true });
console.log('Web: scan above QRCode ' + webUrl + ' or direct open in browser.\n');

qrcode.generate(weexBundleUrl, { small: true });
console.log('Weex: scan above QRCode ' + weexBundleUrl + ' use weex playground.\n');

// enable source map
webpackConfigDev.devtool = 'inline-module-source-map';
webpackConfigDev.entry = {
  'index.bundle': [paths.appIndexJs]
};
// Module hot accept
webpackConfigDev.module.loaders.forEach(loader => {
  if (loader.test.toString() === /\.jsx?$/.toString()) {
    loader.loaders.push(`${require.resolve('../loaders/module-hot-accept')}?appIndex=${paths.appIndexJs}`);
  }
});

Object.keys(webpackConfigDev.entry).forEach(point => {
  // Enable hot reloading
  webpackConfigDev.entry[point].unshift(require.resolve('rax-hot-loader/patch'));
  // webpackConfigDev.entry[point].unshift(`${require.resolve('webpack-dev-server/client')}?${options.protocol}//${options.host}:${options.port}`);
  // // bundle the client for webpack-dev-server
  // // and connect to the provided endpoint
  // webpackConfigDev.entry[point].unshift(require.resolve('webpack/hot/only-dev-server'));
  // // bundle the client for hot reloading
  // // only- means to only hot reload for successful updates

  // hot reaload client.
  webpackConfigDev.entry[point].unshift(require.resolve('../../dev-utils/webpackHotDevClient'));
});

// Only work on web
webpackConfigDev.plugins.push(new RaxHotModuleReplacementPlugin());
webpackConfigDev.plugins.push(new webpack.NoEmitOnErrorsPlugin());

module.exports = webpackConfigDev;
