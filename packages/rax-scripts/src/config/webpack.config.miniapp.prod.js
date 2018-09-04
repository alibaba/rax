const webpackMerge = require('webpack-merge');
const pathConfig = require('./path.config');
const webpackConfigBase = require('./webpack.config.miniapp.base');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const webpackConfigProd = webpackMerge(webpackConfigBase, {
  entry: {
    'index.min': [pathConfig.appManifest],
  },
  output: {
    pathinfo: false,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: {
            unused: false,
            warnings: false,
          },
          output: {
            ascii_only: true,
            comments: 'some',
            beautify: false,
          },
          mangle: true,
        },
      }),
    ],
  },
});

module.exports = webpackConfigProd;
