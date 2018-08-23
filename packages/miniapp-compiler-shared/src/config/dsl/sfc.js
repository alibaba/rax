const { join, resolve, relative } = require('path');
const webpack = require('webpack');
const WebpackWrapPlugin = require('../webpack-plugins/WebpackWrapPlugin');
const WebpackMiniProgramPlugin = require('../webpack-plugins/WebpackMiniProgramPlugin');
const babelConfig = require('../babelConfig');

const SFCLoader = require.resolve('sfc-loader');

/**
 * SFC DSL webpack config
 */
module.exports = (projectDir, opts) => {
  return {
    output: {
      libraryTarget: 'commonjs2',
      path: join(projectDir, 'build/pages'),
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.(vue|html)$/,
          use: [
            {
              loader: SFCLoader,
              /* 使用 framework 中自带的 runtime 以减小体积 */
              options: { builtInRuntime: true },
            }
          ]
        },
        {
          test: /\.jsx?$/,
          loader: require.resolve('babel-loader'),
          options: babelConfig
        }
      ]
    },
    plugins: [
      new WebpackWrapPlugin({
        header: (fileName, entry, chunks) => {
          if (fileName === '$app.js') {
            // app entry
            // 加一个换行 避免注释影响
            return "\nrequire('@core/app').register({type:'app'},function(module,exports,require){";
          } else {
            // page entry
            const pageName = fileName.replace(/\.js$/, '');
            const pageDesc = JSON.stringify({
              page: pageName,
            });
            return `\nrequire('@core/page').register(${pageDesc},function(module,exports,require){`;
          }
        },
        footer: '});'
      }),
      new WebpackMiniProgramPlugin({
        isH5: opts.isDevServer
      })
    ]
  };
};