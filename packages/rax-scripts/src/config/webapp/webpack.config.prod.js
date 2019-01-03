'use strict';
const pathConfig = require('../path.config');
const webpackMerge = require('webpack-merge');
const webpackConfigBase = require('./webpack.config.base');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const webpackConfigProd = webpackMerge(webpackConfigBase, {
  target: 'node',
  entry: {
    'index.bundle.min': [pathConfig.appIndexJs],
  },
  plugins: [
    new UglifyJSPlugin({
      include: /\.min\.js$/,
      cache: true,
      sourceMap: true,
    }),
  ],
});

module.exports = webpackConfigProd;
