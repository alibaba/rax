'use strict';

/* eslint no-console: 0 */
const address = require('address');
const qrcode = require('qrcode-terminal');
const webpack = require('webpack');

const webpackConfigBase = require('./webpack.config.miniapp.base');
const envConfig = require('./env.config');
const pathConfig = require('./path.config');

const webpackConfigDev = Object.assign({}, webpackConfigBase);
const ipv4 = address.ip();
const port = envConfig.port;
const webUrl = 'http://' + ipv4 + ':' + port;
const bundleUrl = 'http://' + ipv4 + ':' + port + '/js/index.bundle.js';
const weexBundleUrl = `${bundleUrl}?_wx_tpl=${bundleUrl}`;

qrcode.generate(webUrl, { small: true });
console.log(
  'Web: scan above QRCode ' + webUrl + ' or direct open in browser.\n',
);

qrcode.generate(weexBundleUrl, { small: true });
console.log(
  'Weex: scan above QRCode ' + weexBundleUrl + ' use weex playground.\n',
);

// enable source map
webpackConfigDev.devtool = 'inline-module-source-map';
webpackConfigDev.entry = {
  index: [pathConfig.appManifest],
};

Object.keys(webpackConfigDev.entry).forEach((point) => {
  // hot reaload client.
  webpackConfigDev.entry[point].unshift(
    require.resolve('../hmr/webpackHotDevClient.entry'),
  );
});

// Only work on web
webpackConfigDev.plugins.push(new webpack.NoEmitOnErrorsPlugin());

module.exports = webpackConfigDev;
