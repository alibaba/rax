const webpack = require('webpack'); // eslint-disable-line
const { resolve } = require('path');
const getBabelConfig = require('../../../babel.config');

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
        atagVersion: JSON.stringify('0.1.41'),
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
