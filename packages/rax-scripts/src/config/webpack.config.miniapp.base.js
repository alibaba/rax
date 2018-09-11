'use strict';
/* eslint no-console: 0 */
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const colors = require('chalk');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const pathConfig = require('./path.config');

const babelOptions = {
  presets: [require.resolve('babel-preset-es2015'), require.resolve('babel-preset-rax')],
  plugins: [require.resolve('rax-hot-loader/babel')],
};

const publicPath = '/';
const publicUrl = '';

module.exports = {
  mode: process.env.NODE_ENV,
  context: process.cwd(),
  target: 'web',
  entry: {},
  output: {
    path: pathConfig.appBuild,
    filename: 'js/[name].js',
    publicPath: publicPath,
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.html', '.vue'],
  },
  externals: [
    function(context, request, callback) {
      if (/^@(core|schema)\//.test(request)) {
        return callback(null, `commonjs2 ${request}`);
      }
      callback();
    },
  ],
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        PUBLIC_URL: JSON.stringify(publicUrl),
      },
    }),
    new CopyWebpackPlugin([
      {
        from: pathConfig.appPublic, // copy static assets in public folder
        to: pathConfig.appBuild,
        ignore: ['.*', '*.html'],
      },
      {
        from: pathConfig.appManifest, // cppy manifest.json
        to: pathConfig.appBuild,
      },
    ]),
    new CaseSensitivePathsPlugin(),
    new webpack.ProgressPlugin(function(percentage, msg) {
      const stream = process.stderr;
      if (stream.isTTY && percentage < 0.71) {
        stream.cursorTo(0);
        stream.write(`webpack: ${msg}...`);
        stream.clearLine(1);
      } else if (percentage === 1) {
        console.log('');
        console.log(colors.green('webpack: bundle build is now finished.'));
      }
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: babelOptions,
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
            options: babelOptions,
          },
          {
            loader: require.resolve('miniapp-manifest-loader'),
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: require.resolve('sfc-loader'),
            options: {
              builtInRuntime: false,
              preserveWhitespace: false,
            },
          },
        ],
        exclude: [pathConfig.appHtml],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
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
  optimization: {
    namedModules: true,
    mergeDuplicateChunks: true,
    splitChunks: {
      cacheGroups: {
        atag: {
          test: /[\\/]atag[\\/]/,
          name: 'atag',
          chunks: 'all',
          minSize: 0,
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true,
          priority: -10,
        },
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: -20,
        },
      },
    },
  },
};
