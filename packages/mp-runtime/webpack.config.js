const webpack = require('webpack');
const { resolve } = require('path');
const { NODE_ENV } = process.env;
const config = {
  mode: NODE_ENV || 'development',
  devtool: NODE_ENV === 'development' ? 'inline-source-map' : false,
  entry: {
    wx: resolve('src/wx')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            require.resolve('babel-preset-env'),
            require.resolve('babel-preset-stage-0')
          ]
        }
      }
    ]
  },
  devServer: {
    port: 8010
  }
};

module.exports = new Promise(done => {
  done(config);
});
