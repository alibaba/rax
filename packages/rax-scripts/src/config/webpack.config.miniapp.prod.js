'use strict';

const pathConfig = require('./path.config');
const webpackConfigBase = require('./webpack.config.miniapp.base');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const webpackConfigProd = Object.assign({}, webpackConfigBase);

webpackConfigProd.entry = {
  'index.min': [pathConfig.appManifest],
};

webpackConfigProd.output.pathinfo = false;

webpackConfigProd.plugins.push(
  new UglifyJSPlugin({
    include: /\.min\.js$/,
    cache: true,
    sourceMap: true,
  }),
);

module.exports = webpackConfigProd;
