const webpack = require('webpack');
const { resolve } = require('path');
const getBabelConfig = require('../../../babel.config');
const { version } = require('../package.json');

function getConfig(type) {
  return {
    mode: 'development',
    entry: {
      [type]: resolve('src/index.js'),
    },
    output: {
      filename: 'miniapp-framework-[name].js',
      library: 'MiniApp',
      libraryTarget: 'umd',
      libraryExport: 'default',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: require.resolve('babel-loader'),
          options: getBabelConfig(),
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        atagVersion: JSON.stringify('0.1.52'),
        frameworkVersion: JSON.stringify(version),
        frameworkType: JSON.stringify(type),
      }),
    ],
    devServer: {
      port: 9002,
    },
  };
}

module.exports = [
  getConfig('web'),
  getConfig('ide'),
];
