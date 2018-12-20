'use strict';
/* eslint no-console: 0 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpackConfig = require('../webpack.config');
const pathConfig = require('../path.config');
const babelConfig = require('../babel.config');

module.exports = {
  mode: webpackConfig.mode,
  context: webpackConfig.context,
  // Compile target should "web" when use hot reload
  target: webpackConfig.target,
  entry: webpackConfig.entry,
  output: webpackConfig.output,
  resolve: webpackConfig.resolve,
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: pathConfig.appHtml,
    }),
    webpackConfig.plugins.define,
    webpackConfig.plugins.caseSensitivePaths,
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: babelConfig,
          },
        ],
      },
      {
        test: /manifest\.json$/,
        type: 'javascript/auto',
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: babelConfig,
          },
          {
            loader: require.resolve('miniapp-manifest-loader'),
          },
        ],
      },
      {
        test: /\.(html|vue|sfc)$/,
        use: [
          {
            loader: require.resolve('sfc-loader'),
            options: {
              builtInRuntime: false,
              builtInRax: false,
              preserveWhitespace: false,
              module: 'commonjs'
            },
          },
        ],
        exclude: [pathConfig.appHtml],
      },
      {
        test: /\.(svg|png|webp|jpe?g|gif)$/i,
        use: [
          // TODO: maybe use image-source-loader
          {
            loader: require.resolve('file-loader'),
            options: {
              name: 'images/[name]-[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
};
