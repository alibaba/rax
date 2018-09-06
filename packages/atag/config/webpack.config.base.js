const { resolve } = require('path');
const { readFileSync, readdirSync } = require('fs');
const webpack = require('webpack');

module.exports = () => {
  return new Promise(done => {
    const entry = {
      atag: [resolve('vendors/intersection-observer.js'), resolve('vendors/native-shim.js'), resolve('src/index.js')]
    };

    const config = {
      entry,
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
          }
        ]
      },
      resolve: {
        modules: [resolve('src'), 'node_modules'],
        extensions: ['.js', '.json', '.html'],
        alias: {
          components: resolve('src/components')
        }
      },
      devServer: {
        contentBase: resolve('.'),
        port: 9001
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new webpack.BannerPlugin({
          banner: `builtAt: ${new Date()}`
        })
      ]
    };

    done(config);
  });
};
