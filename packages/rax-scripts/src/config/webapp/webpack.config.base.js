'use strict';

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackConfig = require('../webpack.config');
const babelConfig = require('../babel.config');

module.exports = function getWebpackBaseConfig(options = {}) {
  const target = options.target || 'web';
  return {
    mode: webpackConfig.mode,
    context: webpackConfig.context,
    // Compile target should "web" when use hot reload
    target: target,
    entry: webpackConfig.entry,
    output: webpackConfig.output,
    resolve: webpackConfig.resolve,
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'client/[name].css',
        chunkFilename: 'client/[name].css',
      }),
      webpackConfig.plugins.define,
      webpackConfig.plugins.caseSensitivePaths,
      process.env.ANALYZER ? new BundleAnalyzerPlugin() : null,
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: babelConfig,
            },
            {
              loader: require.resolve('rax-webpack-plugin/lib/PlatformLoader'),
              options: {
                platform: target
              }
            },
          ],
        },
        {
          test: /\.tsx?$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: babelConfig,
            },
            {
              loader: require.resolve('ts-loader'),
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
                  require('postcss-plugin-rpx2vw')(),
                ],
              }
            },
          ]
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: require.resolve('css-loader'),
            },
            {
              loader: require.resolve('less-loader'),
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
  };
};
