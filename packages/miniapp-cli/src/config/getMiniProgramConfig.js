const { join } = require('path');
const babelConfig = require('./babelConfig');
const WebpackMiniProgramPlugin = require('../plugins/WebpackMiniProgramPlugin');

module.exports = (projectDir, opts) => {
  return {
    output: {
      path: join(projectDir, 'build'),
    },
    module: {
      rules: [
        /**
         * disable webpack-hot-client
         */
        {
          test: /webpack\-hot\-client/,
          loader: require.resolve('null-loader'),
        },
        {
          test: /\.js$/,
          loaders: [
            {
              loader: require.resolve('babel-loader'),
              options: babelConfig,
            },
          ],
        }
      ],
    },
    plugins: [
      new WebpackMiniProgramPlugin({
        isH5: opts.isDevServer,
      }),
    ],
  };
};
