const { join } = require('path');
const babelConfig = require('./babelConfig');
const WebpackMiniProgramPlugin = require('../plugins/WebpackMiniProgramPlugin');

const babelLoaderConfig = {
  loader: require.resolve('babel-loader'),
  options: babelConfig,
};
module.exports = (projectDir, opts) => {
  return {
    output: {
      path: join(projectDir, 'build'),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [babelLoaderConfig],
        },
        /**
         * Post babel loader to compile template attribute expression
         */
        {
          test: /\.axml$/,
          enforce: 'post',
          use: [babelLoaderConfig],
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
                  require('../plugins/PostcssPluginRpx2rem'),
                  require('../plugins/PostcssPluginTagPrefix'),
                  require('autoprefixer')
                ]
              }
            },
          ]
        },
        {
          test: /\.(a?png|jpe?g|gif|webp|svg|ico)$/i,
          loader: require.resolve('../loaders/LocalAssetLoader'),
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
