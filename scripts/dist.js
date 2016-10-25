'use strict';

const path = require('path');
const webpack = require('webpack');
const RxWebpackPlugin = require('rx-webpack-plugin');

dist(getConfig(
  {
    'rx': './packages/universal-rx/src/index.js',
    'rx.min': './packages/universal-rx/src/index.js',
  },
  {
    path: './packages/universal-rx/dist/',
    filename: '[name].js',
    sourceMapFilename: '[name].map',
  },
  {
    moduleName: 'universal-rx',
    globalName: 'Rx',
  }
));

dist(getConfig(
  {
    'env': './packages/universal-env/src/index.js',
    'env.min': './packages/universal-env/src/index.js',
  },
  {
    path: './packages/universal-env/dist/',
    filename: '[name].js',
    sourceMapFilename: '[name].map',
  },
  {
    moduleName: 'universal-env',
    globalName: 'Env',
  }
));

function getConfig(entry, output, moduleOptions) {
  return {
    target: 'node',
    devtool: 'source-map',
    entry: entry,
    output: output,
    plugins: [
      new webpack.NoErrorsPlugin(),
      new RxWebpackPlugin(moduleOptions),
      new webpack.optimize.UglifyJsPlugin({
        include: /\.min\.js$/,
        minimize: true,
        compress: {
          warnings: false
        }
      })
    ],
    module: {
      loaders: [{
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['es2015', 'rx'],
        }
      }]
    }
  };
}

function dist(config){
  let compiler = webpack(config);
  compiler.run(function(err, stats) {
   let options = {
     colors: true
   };
   console.log(stats.toString(options));
  });
}
