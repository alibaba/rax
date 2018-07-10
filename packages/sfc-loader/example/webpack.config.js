const path = require('path');
const webpack = require('webpack');
const minidslLoader = require.resolve('..');

module.exports = new Promise((resolve, reject) => {
  const config = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
      index: path.resolve('example/src/app.js')
    },
    module: {
      rules: [
        {
          test: /\.html$/,
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
        '@core/rax': 'rax'
      }
    },
    devServer: {
      contentBase: __dirname,
      port: 9000
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      })
    ]
  };

  resolve(config);
});
