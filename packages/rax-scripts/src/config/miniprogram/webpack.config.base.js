'use strict';
/* eslint no-console: 0 */
const webpackConfig = require('../webpack.config');
const pathConfig = require('../path.config');
const babelConfig = require('../babel.config');
const { 
  MiniAppWebpackPlugin, 
  PostcssPluginRpx2rem, 
  PostcssPluginTagPrefix, 
  styleResolver
} = require('miniapp-webpack-plugin');

const babelLoaderConfig = {
  loader: require.resolve('babel-loader'),
  options: babelConfig,
};

module.exports = {
  mode: webpackConfig.mode,
  context: webpackConfig.context,
  // Compile target should "web" when use hot reload
  target: webpackConfig.target,
  entry: webpackConfig.entry,
  output: webpackConfig.output,
  resolve: webpackConfig.resolve,
  externals: [
    function(context, request, callback) {
      if (/^@(core|schema)\//.test(request)) {
        return callback(null, `commonjs2 ${request}`);
      }
      callback();
    },
  ],
  plugins: [
    webpackConfig.plugins.define,
    webpackConfig.plugins.caseSensitivePaths,
    new MiniAppWebpackPlugin({
      target: 'web',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [babelLoaderConfig],
      },
      /**
       * Post babel loader to compile template attribute expression
      */
      {
        test: /\.axml$/,
        enforce: 'post',
        use: [babelLoaderConfig],
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
      {
        test: /\.acss$/,
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
                require('postcss-import')({ resolve: styleResolver }),
                PostcssPluginRpx2rem,
                PostcssPluginTagPrefix,
                require('autoprefixer')({ remove: false }),
              ]
            }
          },
        ]
      },
      {
        test: /app\.js$/,
        loader: require.resolve('mp-loader'),
      },
    ],
  },
};
