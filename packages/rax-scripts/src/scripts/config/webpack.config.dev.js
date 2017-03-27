'use strict';
/* eslint no-console: 0 */
const URL = require('url').URL;
const address = require('address');
const qrcode = require('qrcode-terminal');
const webpack = require('webpack');

const paths = require('./paths');
const webpackConfigBase = require('./webpack.config.base');

const webpackConfigDev = Object.assign({}, webpackConfigBase);

const ipv4 = address.ip();
const port = 8080;
const webUrl = 'http://' + ipv4 + ':' + port;
const bundleUrl = 'http://' + ipv4 + ':' + port + '/js/index.bundle.js';
const weexBundleUrl = new URL(bundleUrl);

weexBundleUrl.searchParams.append('wh_weex', true);
weexBundleUrl.searchParams.append('wh_native', true);
weexBundleUrl.searchParams.append('_wx_tpl', bundleUrl);

qrcode.generate(webUrl, { small: true });
console.log('Web: scan above QRCode ' + webUrl + ' or direct open in browser.\n');

qrcode.generate(weexBundleUrl.toString(), { small: true });
console.log('Weex: scan above QRCode ' + weexBundleUrl.toString() + ' use weex playground.\n');

// enable source map
webpackConfigDev.devtool = 'inline-module-source-map';
webpackConfigDev.entry = {
  'index.bundle': [paths.appIndexJs]
};

// enable entry point module hot accept.
const webpackHotDevClient = require.resolve('react-dev-utils/webpackHotDevClient');

Object.keys(webpackConfigDev.entry).forEach(point => {
  webpackConfigDev.entry[point].unshift(webpackHotDevClient);
});

webpackConfigDev.module.loaders.forEach(loader => {
  if (loader.test.toString() === /\.jsx?$/.toString()) {
    loader.loaders.push(require.resolve('../loaders/module-hot-accept'));
  }
});

webpackConfigDev.plugins.push(new webpack.HotModuleReplacementPlugin());
webpackConfigDev.plugins.push(new webpack.NoErrorsPlugin());

module.exports = webpackConfigDev;
