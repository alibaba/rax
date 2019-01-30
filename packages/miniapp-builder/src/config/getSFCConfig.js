const { join } = require('path');
const WebpackWrapPlugin = require('../plugins/WebpackWrapPlugin');
const WebpackMiniProgramPlugin = require('../plugins/WebpackMiniProgramPlugin');
const babelConfig = require('./babelConfig');

const SFCLoader = require.resolve('sfc-loader');

/**
 * SFC DSL webpack config
 */
module.exports = (projectDir, opts) => {
  const { appConfig, isDevServer } = opts;
  const shouldEnableSourceMap = isDevServer === true;
  return {
    devtool: shouldEnableSourceMap ? 'eval-source-map' : false,
    output: {
      libraryTarget: 'commonjs2',
      path: join(projectDir, 'build/pages'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.(sfc|vue|html)$/,
          oneOf: [
            {
              resourceQuery: /\?style/,
              use: [
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    /**
                     * @NOTE This sourceMap option can override webpack's devtool.
                     */
                    sourceMap: shouldEnableSourceMap,
                    importLoaders: 1 // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
                  }
                },
                {
                  loader: require.resolve('postcss-loader'),
                  options: {
                    sourceMap: shouldEnableSourceMap,
                    plugins: [
                      require('postcss-import')({ resolve: require('./styleResolver') }),
                      require('../plugins/PostcssPluginRpx2rem'),
                      require('../plugins/PostcssPluginTagPrefix'),
                      require('autoprefixer')({
                        remove: false,
                        browsers: ['ios_saf 8'],
                      }),
                    ]
                  }
                },
                {
                  loader: SFCLoader,
                  options: {
                    part: 'style',
                  },
                }
              ]
            },
            {
              loader: SFCLoader,
              options: {
                builtInRax: true,
                module: 'commonjs',
                cssInJS: !appConfig.enableCSS,
              },
            }
          ],

        },
        {
          test: /\.jsx?$/,
          loader: require.resolve('babel-loader'),
          options: babelConfig,
        },
      ],
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
        footer: '});',
      }),
      new WebpackMiniProgramPlugin({
        isH5: opts.isDevServer,
      }),
    ],
  };
};
