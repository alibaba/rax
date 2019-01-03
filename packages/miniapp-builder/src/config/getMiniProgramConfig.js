const { join } = require('path');
const babelConfig = require('./babelConfig');
const styleResolver = require('./styleResolver');
const WebpackMiniProgramPlugin = require('../plugins/WebpackMiniProgramPlugin');

const babelLoaderConfig = {
  loader: require.resolve('babel-loader'),
  options: babelConfig,
};

module.exports = (projectDir, opts) => {
  return {
    devtool: opts.isDevServer ? 'eval-source-map' : false,
    output: {
      path: join(projectDir, 'build'),
      // show at devtool console panel
      devtoolModuleFilenameTemplate: 'webpack://[namespace]/[resource-path]',
      devtoolNamespace: 'miniapp',
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
                sourceMap: true,
                importLoaders: 1 // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
              }
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                sourceMap: true,
                plugins: [
                  require('postcss-import')({ resolve: styleResolver }),
                  require('../plugins/PostcssPluginRpx2rem'),
                  require('../plugins/PostcssPluginTagPrefix'),
                  require('autoprefixer')({
                    remove: false,
                    browsers: ['ios_saf 8'],
                  }),
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
