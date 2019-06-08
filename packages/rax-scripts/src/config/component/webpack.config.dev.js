'use strict';

/* eslint no-console: 0 */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const RaxWebpackPlugin = require('rax-webpack-plugin');
const webpackConfig = require('../webpack.config');
const pathConfig = require('../path.config');
const babelConfig = require('./babel.config');

const webpackConfigDev = {
  devtool: 'inline-module-source-map',
  entry: {
    index: [pathConfig.componentDemoJs]
  },
  output: Object.assign(webpackConfig.output, {
    publicPath: '/',
    pathinfo: true
  }),
  mode: webpackConfig.mode,
  context: webpackConfig.context,
  // Compile target should "web" when use hot reload
  target: webpackConfig.target,
  resolve: webpackConfig.resolve,
  plugins: [
    new RaxWebpackPlugin({
      target: 'bundle',
      externalBuiltinModules: false
    }),
    webpackConfig.plugins.define,
    webpackConfig.plugins.caseSensitivePaths,
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, './public/index.html')
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: babelConfig
          },
          {
            loader: require.resolve('ts-loader'),
            options: {
              compilerOptions: {
                rootDir: process.cwd()
              }
            }
          }
        ]
      },
      {
        test: /\.(js|mjs|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: babelConfig
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: require.resolve('stylesheet-loader')
          }
        ]
      },
      // load inline images using image-source-loader for Image
      {
        test: /\.(svg|png|webp|jpe?g|gif)$/i,
        use: [
          {
            loader: require.resolve('image-source-loader')
          }
        ]
      }
    ]
  }
};

Object.keys(webpackConfigDev.entry).forEach(point => {
  // hot reaload client.
  webpackConfigDev.entry[point].unshift(require.resolve('../../hmr/webpackHotDevClient.entry'));
});

module.exports = webpackConfigDev;
