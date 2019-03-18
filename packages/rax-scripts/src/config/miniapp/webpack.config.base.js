'use strict';
/* eslint no-console: 0 */
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackConfig = require('../webpack.config');
const pathConfig = require('../path.config');
const babelConfig = require('../babel.config');

const SFCLoader = require.resolve('sfc-loader');

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
        oneOf: [
          {
            resourceQuery: /\?style/,
            use: [
              {
                loader: require.resolve('css-loader'),
                options: {
                  sourceMap: true,
                  importLoaders: 1 // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
                }
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  sourceMap: true,
                  plugins: [
                    require('postcss-import')({ resolve: require('./styleResolver') }),
                    require('../plugins/PostcssPluginRpx2rem'),
                    require('../plugins/PostcssPluginTagPrefix'),
                    require('autoprefixer')({
                      remove: false,
                      browsers: ['ios_saf 8'],
                    }),
                  ]
                }
              },
              {
                loader: SFCLoader,
                options: {
                  part: 'style',
                },
              }
            ]
          },
          {
            loader: SFCLoader,
            options: {
              builtInRax: true,
              module: 'commonjs',
            },
          }
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
