process.env.BABEL_ENV = 'test';

const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: 'raw-loader'
      },
      {
        test: /\.less$/,
        use: ['raw-loader', 'less-loader']
      },
      {
        test: /\.html$/,
        use: ['babel-loader', 'polymer-webpack-loader']
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [resolve('vendors')]
      },
      {
        test: /\.(png|gif|jpe?g|svg)$/i,
        loader: 'url-loader',
      }
    ]
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.html'],
    alias: {
      components: resolve('src/components')
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.IgnorePlugin(/\.md/)
  ]
};
