const { resolve } = require('path');
const webpack = require('webpack');

module.exports = () => {
  return new Promise(done => {
    const entry = {
      atag: [resolve('vendors/intersection-observer.js'), resolve('vendors/custom-elements-es5-adapter.js'), resolve('src/index.js')]
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
          },
          {
            test: /\.(png|gif|jpe?g|svg)$/i,
            loader: 'url-loader',
          },
        ]
      },
      resolve: {
        modules: ['node_modules'],
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
