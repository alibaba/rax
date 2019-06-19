'use strict';

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const babelMerge = require('babel-merge');
const babelConfig = require('../babel.config');
const pathConfig = require('../path.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackConfigBase = require('./webpack.config.base');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WeexFrameworkBanner = require('../../plugins/WeexFrameworkBannerPlugin');

const hmrClient = require.resolve('../../hmr/webpackHotDevClient.entry');
const UNIVERSAL_APP_SHELL_LOADER = require.resolve('universal-app-shell-loader');

const babelConfigWeb = babelMerge.all([{
  plugins: [require.resolve('rax-hot-loader/babel')],
}, babelConfig]);

const babelConfigWeex = babelMerge.all([{
  plugins: [
    require.resolve('babel-plugin-transform-jsx-stylesheet'),
    require.resolve('rax-hot-loader/babel'),
  ],
}, babelConfig]);

module.exports = [
  // Web bundle config for webpack.
  webpackMerge(webpackConfigBase, {
    devtool: 'inline-module-source-map',
    entry: {
      'index.web': [hmrClient, UNIVERSAL_APP_SHELL_LOADER + '?type=web!' + pathConfig.universalAppEntry],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: babelConfigWeb,
            },
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
              options: babelConfigWeb,
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: require.resolve('css-loader'),
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                ident: 'postcss',
                plugins: () => [
                  require('postcss-preset-env')({
                    autoprefixer: {
                      flexbox: 'no-2009',
                    },
                    stage: 3,
                  }),
                  require('./postcss-plugin-rpx2rem'),
                ],
              }
            },
          ]
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
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        template: pathConfig.appHtml,
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new webpack.NoEmitOnErrorsPlugin(),
    ],
  }),
  // Weex bundle config for webpack.
  webpackMerge(webpackConfigBase, {
    devtool: 'inline-module-source-map',
    entry: {
      'index.weex': [hmrClient, UNIVERSAL_APP_SHELL_LOADER + '?type=weex!' + pathConfig.universalAppEntry],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: babelConfigWeex,
            },
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
              options: babelConfigWeex,
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
    plugins: [
      new WeexFrameworkBanner(),
      new webpack.NoEmitOnErrorsPlugin(),
    ],
  })
];
