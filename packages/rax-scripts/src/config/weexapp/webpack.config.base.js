'use strict';

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpackConfig = require('../webpack.config');
const pathConfig = require('../path.config');
const babelConfig = require('../babel.config');
const WeexFrameworkBanner = require('../../plugins/WeexFrameworkBannerPlugin');

babelConfig.plugins.push(
  require.resolve('babel-plugin-transform-jsx-stylesheet')
);

module.exports = {
  mode: webpackConfig.mode,
  context: webpackConfig.context,
  // Compile target should "web" when use hot reload
  target: webpackConfig.target,
  entry: webpackConfig.entry,
  output: Object.assign(webpackConfig.output, {
    filename: '[name].js'
  }),
  resolve: webpackConfig.resolve,

  plugins: [
    new WeexFrameworkBanner(),
    webpackConfig.plugins.define,
    webpackConfig.plugins.caseSensitivePaths,
    process.env.ANALYZER ? new BundleAnalyzerPlugin() : null,
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: require.resolve('ts-loader'),
          },
        ],
      },
      {
        test: /\.(js|mjs|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: babelConfig,
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: require.resolve('stylesheet-loader'),
          },
        ],
      },
      // load inline images using image-source-loader for Image
      {
        test: /\.(svg|png|webp|jpe?g|gif)$/i,
        use: [
          {
            loader: require.resolve('image-source-loader'),
          },
        ],
      },
    ],
  },
};
