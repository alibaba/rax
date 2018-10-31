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
        {
          test: /\.js$/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: babelConfig,
            }
          ]
        },
        {
          test: /\.acss$/,
          use: [
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1 // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
              }
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                plugins: [
                  require('mp-loader/src/postcss-rpx2rem'),
                  require('mp-loader/src/postcss-tag-prefix'),
                  require('autoprefixer')
                ]
              }
            },
          ]
        },
        {
          test: /app\.js$/,
          loader: require.resolve('mp-loader'),
        },
      ],
    },
    plugins: [
      new WebpackMiniProgramPlugin({
        isH5: opts.isDevServer,
      }),
    ],
  };
};
