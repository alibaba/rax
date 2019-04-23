'use strict';

var path = require('path');
var webpack = require('webpack');
var pathConfig = require('../path.config');
var uppercamelcase = require('uppercamelcase');
var RaxPlugin = require('rax-webpack-plugin');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var babelOptions = require('../babel.config');

var appPackage = require(pathConfig.appPackageJson);

var main = path.join(process.cwd(), '/src/index.js');
var packageName = appPackage.name;
var entryName = packageName.split('-')[1];
var entry = {};
entry[entryName] = entry[entryName + '.min'] = entry[entryName + '.factory'] = main;
var globalName = uppercamelcase(packageName);

babelOptions.presets.push([
  require.resolve('@babel/preset-react'), {
    'pragma': 'createElement',
    'pragmaFrag': 'Fragment'
  }
]);


function getConfig(entry, output, moduleOptions, babelLoaderQuery, target, devtool) {
  // Webpack need an absolute path
  output.path = path.resolve(__dirname, '..', output.path);

  return {
    mode: 'production',
    target: target || 'node',
    devtool: devtool || 'source-map',
    optimization: {
      minimize: false
    },
    stats: {
      optimizationBailout: true,
    },
    entry: entry,
    output: output,
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      new webpack.NoEmitOnErrorsPlugin(),
      new RaxPlugin(moduleOptions),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new UglifyJSPlugin({
        include: /\.min\.js$/,
        sourceMap: true
      })
    ],
    module: {
      rules: [{
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: require.resolve('babel-loader'), // 'babel-loader' is also a legal name to reference
        options: babelLoaderQuery
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: require.resolve('stylesheet-loader')
          }
        ],
      },
      {
        test: /\.(svg|png|webp|jpe?g|gif)$/i,
        use: [
          {
            loader: require.resolve('image-source-loader')
          }
        ]
      }]
    }
  };
}

var webpackConfigProd = getConfig(
  entry,
  {
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    pathinfo: false,
  },
  {
    externalBuiltinModules: true,
    builtinModules: Object.assign({
      mobx: ['mobx'],
      redux: ['redux']
    }, RaxPlugin.BuiltinModules),
    moduleName: packageName,
    globalName: globalName,
  },
  babelOptions
);

module.exports = webpackConfigProd;
