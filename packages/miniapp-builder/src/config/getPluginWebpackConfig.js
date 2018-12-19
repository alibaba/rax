const { resolve } = require('path');
const merge = require('webpack-merge');
const { getAppConfig } = require('./getAppConfig');
const styleResolver = require('./styleResolver');
const webpackBaseConfig = require('./webpackBaseConfig');
const babelConfig = require('./babelConfig');

const pluginLoader = require.resolve('mp-loader/src/plugin-loader');

const babelLoaderConfig = {
  loader: require.resolve('babel-loader'),
  options: babelConfig,
};

module.exports = function(pluginDir, options) {
  const { pluginName } = options;
  const pluginConfigPath = resolve(pluginDir, 'plugin.json');
  const pluginConfig = require(pluginConfigPath);
  const pluginWebpackConfig = {
    entry: {
      index: pluginLoader + '?pluginName=' + pluginName + '&pluginConfig=' + encodeURIComponent(pluginConfigPath) + '!' + pluginConfig.main || 'index.js',
    },
    mode: process.env.NODE_ENV || 'development',
    context: pluginDir,
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
                  require('autoprefixer')({ remove: false }),
                ]
              }
            },
          ]
        },
        {
          test: /\.(a?png|jpe?g|gif|webp|svg|ico)$/i,
          loader: require.resolve('../loaders/LocalAssetLoader'),
        },
      ],
    },
    plugins: [
      new class {
        apply(compiler) {
          compiler.hooks.compilation.tap('compilation', (compilation) => {
            compilation.hooks.optimizeAssets.tap('MiniAppPlugin', () => {
              global.AppPluginContent = compilation.assets['index.js'].source();
            });
          });
        }
      }
    ],
  };

  return merge(
    webpackBaseConfig,
    pluginWebpackConfig
  );
};
