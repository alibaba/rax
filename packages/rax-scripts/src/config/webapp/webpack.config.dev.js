'use strict';

/* eslint no-console: 0 */
const address = require('address');
const qrcode = require('qrcode-terminal');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const pathConfig = require('../path.config');
const webpackConfigBase = require('./webpack.config.base');
const optionConfig = require('../option.config');

const host = optionConfig.host;
const port = optionConfig.port;
const webUrl = 'http://' + host + ':' + port;
const bundleUrl = 'http://' + host + ':' + port + '/js/index.bundle.js';
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
