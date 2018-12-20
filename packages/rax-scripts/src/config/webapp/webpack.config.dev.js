'use strict';

/* eslint no-console: 0 */
const address = require('address');
const qrcode = require('qrcode-terminal');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const pathConfig = require('../path.config');
const webpackConfigBase = require('./webpack.config.base');
const envConfig = require('../env.config');

const ipv4 = address.ip();
const port = envConfig.port;
const webUrl = 'http://' + ipv4 + ':' + port;
const bundleUrl = 'http://' + ipv4 + ':' + port + '/js/index.bundle.js';
const weexBundleUrl = `${bundleUrl}?_wx_tpl=${bundleUrl}`;

qrcode.generate(webUrl, { small: true });
console.log('Web: scan above QRCode ' + webUrl + ' or direct open in browser.\n');

qrcode.generate(weexBundleUrl, { small: true });
console.log('Weex: scan above QRCode ' + weexBundleUrl + ' use weex playground.\n');

// enable source map
const webpackConfigDev = webpackMerge(webpackConfigBase, {
  devtool: 'inline-module-source-map',
  entry: {
    'index.bundle': [pathConfig.appIndexJs],
  },
  output: {
    publicPath: '/',
  },
  plugins: [new webpack.NoEmitOnErrorsPlugin()], // Only work on web
});

Object.keys(webpackConfigDev.entry).forEach((point) => {
  // hot reaload client.
  webpackConfigDev.entry[point].unshift(require.resolve('../../hmr/webpackHotDevClient.entry'));
});

module.exports = webpackConfigDev;
