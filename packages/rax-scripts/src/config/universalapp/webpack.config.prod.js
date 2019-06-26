'use strict';

const webpack = require('webpack');
const pathConfig = require('../path.config');
const webpackMerge = require('webpack-merge');
const webpackConfigBase = require('./webpack.config.base');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const babelMerge = require('babel-merge');
const babelConfig = require('../babel.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WeexFrameworkBanner = require('../../plugins/WeexFrameworkBannerPlugin');

const UNIVERSAL_APP_SHELL_LOADER = require.resolve('universal-app-shell-loader');
const getOptimization = () => ({
  minimize: true,
  minimizer: [
    new UglifyJSPlugin({
      include: /\.min\.js$/,
      cache: true,
      sourceMap: true,
    }),
    new OptimizeCSSAssetsPlugin({
      // A boolean indicating if the plugin can print messages to the console
      canPrint: true
    })
  ]
});
const devtool = 'source-map';
const babelConfigWeb = babelMerge({}, babelConfig);
const babelConfigWeex = babelMerge.all([{
  plugins: [
    require.resolve('babel-plugin-transform-jsx-stylesheet')
  ],
}, babelConfig]);


module.exports = [
  // Web bundle config for webpack.
  webpackMerge(webpackConfigBase, {
    devtool,
    entry: {
      'index.web': [UNIVERSAL_APP_SHELL_LOADER + '?type=web!' + pathConfig.universalAppEntry],
    },
    optimization: getOptimization(),
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
            // Todo platform loader
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
    devtool,
    entry: {
      'index.weex': [UNIVERSAL_APP_SHELL_LOADER + '?type=weex!' + pathConfig.universalAppEntry],
    },
    optimization: getOptimization(),
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
          // exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: babelConfigWeex,
            },
            // Todo platform loader
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
