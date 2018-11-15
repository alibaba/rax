const { join } = require('path');
const WebpackMiniProgramPlugin = require('../plugins/WebpackMiniProgramPlugin');
const babelConfig = require('./babelConfig');

const SFCLoader = require.resolve('sfc-loader');
const SFCAppLoader = require.resolve('sfc-loader/src/app-loader');

/**
 * SFC DSL webpack config
 */
module.exports = (projectDir, opts) => {
  return {
    output: {
      path: join(projectDir, 'build'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.(vue|html)$/,
          loader: SFCLoader,
        },
        {
          test: /app\.js$/,
          loader: SFCAppLoader,
        },
        {
          test: /\.jsx?$/,
          loader: require.resolve('babel-loader'),
          options: babelConfig,
        },
      ],
    },
    resolve: {
      alias: {
        rax: require.resolve('rax'),
      },
    },
    plugins: [
      // new WebpackWrapPlugin({
      //   header: (fileName, entry, chunks) => {
      //     if (fileName === 'app.js') {
      //       // app entry
      //       // 加一个换行 避免注释影响
      //       return "\nrequire('@core/app').register({type:'app'},function(module,exports,require){";
      //     } else {
      //       // page entry
      //       const pageName = fileName.replace(/\.js$/, '');
      //       const pageDesc = JSON.stringify({
      //         page: pageName,
      //       });
      //       return `\nrequire('@core/page').register(${pageDesc},function(module,exports,require){`;
      //     }
      //   },
      //   footer: '});',
      // }),
      new WebpackMiniProgramPlugin({
        isH5: opts.isDevServer,
      }),
    ],
  };
};
