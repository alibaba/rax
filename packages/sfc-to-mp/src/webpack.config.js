const path = require('path');
const log = require('fancy-log');
const colors = require('chalk');

const getEntry = require('./config/getEntry');
const { getOption } = require('./config/cliOptions');

const cwd = process.cwd();
const targetType = getOption('target');

const targetMap = {
  ali: '支付宝小程序',
  wx: '微信小程序',
};

log.info(colors.green('Transform to miniapp type:'), targetMap[targetType]);

module.exports = {
  mode: 'development',
  devtool: false,
  resolve: {
    alias: {
      'webpack-hot-client/client': require.resolve('webpack-hot-client/client'),
    },
    extensions: ['.js', '.json', '.html', 'vue'],
  },
  context: cwd,
  entry: getEntry(),
  output: {
    path: path.resolve(cwd, getOption('output')),
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        loader: 'url-loader',
        options: {
          limit: 9182,
          name: 'assets/[hash].[ext]',
        },
      },
    ],
  },
  externals: [
    function(context, request, callback) {
      // 判断 request 的文件地址是否为 sources 、vendors
      // 这两个目录下的文件是转换后的用户文件，以及运行时依赖
      const requestAbsolutePath = path.resolve(context, request);
      if (/\/(vendors|sources)/.test(requestAbsolutePath)) {
        return callback(null, `commonjs2 ${request}`);
      } else {
        return callback();
      }
    },
  ],
};
