/* eslint-disable */
process.env.BABEL_ENV = 'test';
const webpack = require('webpack');

const minidslLoader = require.resolve('..');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(vue|html)$/,
        use: ['babel-loader', minidslLoader]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    alias: {
      utils: require.resolve('./utils'),
      '@core/rax': 'rax'
    },
    extensions: ['.js', '.html', '.vue', '.json']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"testing"'
    })
  ]
};
