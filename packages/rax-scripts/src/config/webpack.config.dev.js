'use strict';

/* eslint no-console: 0 */
const address = require('address');
const qrcode = require('qrcode-terminal');
const webpack = require('webpack');
const pathConfig = require('./path.config');
const webpackConfigBase = require('./webpack.config.base');
const envConfig = require('./env.config');
const RaxHotModuleReplacementPlugin = require('rax-hot-module-replacement-webpack-plugin');

const webpackConfigDev = Object.assign({}, webpackConfigBase);
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
webpackConfigDev.devtool = 'inline-module-source-map';
webpackConfigDev.entry = {
  'index.bundle': [pathConfig.appIndexJs]
};
// Module hot accept
webpackConfigDev.module.rules.forEach(loader => {
  if (loader.test.toString() === /\.jsx?$/.toString()) {
    loader.use.push({
      loader: `${require.resolve('../hmr/moduleHotAccept.loader')}`,
      options: {
        appIndex: pathConfig.appIndexJs
      }
    });
  }
});

Object.keys(webpackConfigDev.entry).forEach(point => {
  // Enable hot reloading
  webpackConfigDev.entry[point].unshift(require.resolve('rax-hot-loader/patch'));
  // webpackConfigDev.entry[point].unshift(`${require.resolve('webpack-dev-server/client')}?${envConfig.protocol}//${envConfig.host}:${envConfig.port}`);
  // // bundle the client for webpack-dev-server
  // // and connect to the provided endpoint
  // webpackConfigDev.entry[point].unshift(require.resolve('webpack/hot/only-dev-server'));
  // // bundle the client for hot reloading
  // // only- means to only hot reload for successful updates

  // hot reaload client.
  webpackConfigDev.entry[point].unshift(require.resolve('../hmr/webpackHotDevClient.entry'));
});

// Only work on web
webpackConfigDev.plugins.push(new RaxHotModuleReplacementPlugin());
webpackConfigDev.plugins.push(new webpack.NoEmitOnErrorsPlugin());

module.exports = webpackConfigDev;
