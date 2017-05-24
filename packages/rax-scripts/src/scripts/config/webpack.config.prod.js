'use strict';
const webpack = require('webpack');

const paths = require('./paths');
const webpackConfigBase = require('./webpack.config.base');

const webpackConfigProd = Object.assign({}, webpackConfigBase);

webpackConfigProd.entry = {
  'index.bundle.min': [paths.appIndexJs]
};

webpackConfigProd.output.pathinfo = false;
webpackConfigProd.target = 'node';

webpackConfigProd.plugins.push(
  new webpack.optimize.UglifyJsPlugin({
    include: /\.min\.js$/,
    minimize: true,
    compress: {
      warnings: false
    }
  })
);

module.exports = webpackConfigProd;
