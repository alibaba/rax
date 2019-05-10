'use strict';

var path = require('path');
var webpack = require('webpack');
var pathConfig = require('../path.config');
var webpackMerge = require('webpack-merge');
var webpackConfigBase = require('./webpack.config.base');
var uppercamelcase = require('uppercamelcase');
var RaxPlugin = require('rax-webpack-plugin');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var babelOptions = require('./babel.config');

var appPackage = require(pathConfig.appPackageJson);

var main = path.join(process.cwd(), '/src/index');
var packageName = appPackage.name;
var entryName = packageName.split('-')[1];
var entry = {};
entry[entryName] = entry[entryName + '.min'] = entry[entryName + '.factory'] = main;
var globalName = uppercamelcase(packageName);

function getConfig(entry, output, moduleOptions, babelLoaderQuery, target, devtool) {
  // Webpack need an absolute path
  output.path = path.resolve(__dirname, '..', output.path);

  return webpackConfigProd = webpackMerge(webpackConfigBase, {
    mode: 'production',
    target: target || 'node',
    devtool: devtool || 'source-map',
    optimization: {
      minimize: false
    },
    stats: {
      optimizationBailout: true
    },
    entry: entry,
    output: output,
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.NoEmitOnErrorsPlugin(),
      new RaxPlugin(moduleOptions),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new UglifyJSPlugin({
        include: /\.min\.js$/,
        sourceMap: true
      })
    ]
  });
}

var webpackConfigProd = getConfig(
  entry,
  {
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    pathinfo: false
  },
  {
    externalBuiltinModules: true,
    builtinModules: Object.assign(
      {
        mobx: ['mobx'],
        redux: ['redux']
      },
      RaxPlugin.BuiltinModules
    ),
    moduleName: packageName,
    globalName: globalName
  },
  babelOptions
);

module.exports = webpackConfigProd;
