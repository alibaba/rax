const { resolve } = require('path');
const getBabelConfig = require('../../babel.config');

module.exports = {
  mode: 'development',
  entry: resolve('src/index.js'),
  output: {
    filename: 'miniapp-framework-web.js'
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
  devServer: {
    port: 9002,
  },
};
