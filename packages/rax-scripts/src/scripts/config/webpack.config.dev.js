'use strict';
/* eslint no-console: 0 */
const address = require('address');
const qrcode = require('qrcode-terminal');
const webpack = require('webpack');

const paths = require('./paths');
const webpackConfigBase = require('./webpack.config.base');
const options = require('../utils/parse-options');
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

// enable entry point module hot accept.
const webpackHotDevClient = require.resolve('react-dev-utils/webpackHotDevClient');

Object.keys(webpackConfigDev.entry).forEach(point => {
  // Enable hot reloading
  webpackConfigDev.entry[point].unshift(require.resolve('rax-hot-loader/patch'));
  webpackConfigDev.entry[point].unshift(webpackHotDevClient);
});

webpackConfigDev.plugins.push(new webpack.HotModuleReplacementPlugin());
webpackConfigDev.plugins.push(new webpack.NoEmitOnErrorsPlugin());

module.exports = webpackConfigDev;
