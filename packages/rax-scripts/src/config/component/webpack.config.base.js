'use strict';
/* eslint no-console: 0 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const RaxWebpackPlugin = require('rax-webpack-plugin');
const webpackConfig = require('../webpack.config');
const pathConfig = require('../path.config');
const babelConfig = require('../babel.config');

babelConfig.presets.push([
  require.resolve('@babel/preset-react'), {
    'pragma': 'createElement',
    'pragmaFrag': 'Fragment'
  }
]);

babelConfig.plugins.push(
  require.resolve('babel-plugin-transform-jsx-stylesheet'),
  require.resolve('rax-hot-loader/babel')
);

module.exports = {
  mode: webpackConfig.mode,
  context: webpackConfig.context,
  // Compile target should "web" when use hot reload
  target: webpackConfig.target,
  entry: webpackConfig.entry,
  output: Object.assign({
    pathinfo: true,
  }, webpackConfig.output),

  resolve: webpackConfig.resolve,

  plugins: [
    new RaxWebpackPlugin({
      target: 'bundle',
      externalBuiltinModules: false,
    }),
    // Generates an `index.html` file with the <script> injected.
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
