'use strict';
const webpack = require('webpack');

const pathConfig = require('./path.config');
const webpackConfigBase = require('./webpack.config.base');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const webpackConfigProd = Object.assign({}, webpackConfigBase);

webpackConfigProd.entry = {
  'index.bundle.min': [pathConfig.appIndexJs]
};

webpackConfigProd.output.pathinfo = false;
webpackConfigProd.target = 'node';

webpackConfigProd.plugins.push(
  new UglifyJSPlugin({
    include: /\.min\.js$/,
    cache: true,
    sourceMap: true,
  })
);

module.exports = webpackConfigProd;
