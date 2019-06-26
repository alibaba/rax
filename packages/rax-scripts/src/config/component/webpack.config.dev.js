'use strict';
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');
const RaxWebpackPlugin = require('rax-webpack-plugin');
const glob = require('glob');
const parseMD = require('../../utils/parseMd');
const webpackConfig = require('../webpack.config');
const pathConfig = require('../path.config');
const babelConfig = require('./babel.config');

const loadersPath = path.join(__dirname, '../../loaders');
const packageInfo = require(path.resolve(process.cwd(), 'package.json'));

const entrys = {};
const HTMLs = [];
const demos = [];

glob.sync(path.join(process.cwd(), 'demo/*.md')).forEach((filename) => {
  const name = filename.substring(filename.lastIndexOf('/') + 1, filename.indexOf('.md'));
  const result = parseMD(name, fs.readFileSync(filename, 'utf8'), filename);
  entrys[name] = filename;
  HTMLs.push(new HtmlWebpackPlugin({
    inject: true,
    template: path.resolve(__dirname, './public/index.html'),
    title: name,
    filename: `demo/${name}.html`,
    chunks: [name],
  }));

  demos.push({
    ...result.meta
  });
});

const webpackConfigDev = {
  devtool: 'inline-module-source-map',
  entry: {
    index: pathConfig.componentDemoJs,
    ...entrys,
  },
  output: Object.assign(webpackConfig.output, {
    publicPath: '/',
    pathinfo: true,
    chunkFilename: 'js/[name].chunk.js',
  }),
  mode: webpackConfig.mode,
  context: webpackConfig.context,
  // Compile target should "web" when use hot reload
  target: webpackConfig.target,
  resolve: {
    ...webpackConfig.resolve,
    alias: {
      ...webpackConfig.resolve.alias,
      [packageInfo.name]: path.resolve(process.cwd(), 'src/index')
    }
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //     name: false,
  //   },
  //   runtimeChunk: true
  // },
  plugins: [
    new RaxWebpackPlugin({
      target: 'bundle',
      externalBuiltinModules: false
    }),
    webpackConfig.plugins.define,
    webpackConfig.plugins.caseSensitivePaths,
    new HtmlWebpackPlugin({
      inject: true,
      title: 'index',
      template: path.resolve(__dirname, './public/index.html'),
      filename: 'index.html',
      chunks: ['index'],
      demos,
    }),
    ...HTMLs,
    new webpack.NoEmitOnErrorsPlugin()
  ],
  resolveLoader: {
    alias: {
      'demo-loader': path.join(loadersPath, 'demo.js')
    },
  },
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
        test: /demo\/.+\.md$/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: babelConfig
          },
          {
            loader: 'demo-loader',
            options: {}
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
  if (!Array.isArray(webpackConfigDev.entry[point])) {
    webpackConfigDev.entry[point] = [webpackConfigDev.entry[point]];
  }
  // hot reaload client.
  webpackConfigDev.entry[point].unshift(require.resolve('../../hmr/webpackHotDevClient.entry'));
});

module.exports = webpackConfigDev;
