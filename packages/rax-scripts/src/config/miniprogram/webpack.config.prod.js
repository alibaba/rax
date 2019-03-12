const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpackMerge = require('webpack-merge');

const pathConfig = require('../path.config');
const optionConfig = require('../option.config');
const webpackConfigBase = require('./webpack.config.base');

const isDebug = optionConfig.debug;

const webpackConfigProd = webpackMerge(webpackConfigBase, {
  devtool: isDebug ? 'cheap-eval-source-map' : false,
  entry: {
    'index.min': [pathConfig.miniProgramIndexJs],
  },
  output: {
    path: path.resolve(pathConfig.appDirectory, optionConfig.outputPath || 'build'),
    publicPath: optionConfig.publicPath || '/',
  },
  optimization: {
    minimize: isDebug ? false : true,
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
            // eslint-disable-next-line camelcase
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
