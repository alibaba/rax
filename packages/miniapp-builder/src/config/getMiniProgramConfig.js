const { join, extname } = require('path');
const babelConfig = require('./babelConfig');
const WebpackMiniProgramPlugin = require('../plugins/WebpackMiniProgramPlugin');

const ABSOLUTE_REG = /^\//;
const RELATIVE_REG = /^\./;
const STYLE_EXT = '.acss';

const babelLoaderConfig = {
  loader: require.resolve('babel-loader'),
  options: babelConfig,
};

/**
 * Resolve postcss file path
 * eg.
 *   @import "./button.acss"; // relative path
 *   @import "/button.acss"; // absolute path to project
 *   @import "third-party/button.acss"; // npm package
 */
function styleResolver(id, basedir, importOptions) {
  let filePath;
  if (ABSOLUTE_REG.test(id)) {
    filePath = join(importOptions.root, id);
  } else if (RELATIVE_REG.test(id)) {
    filePath = join(basedir, id);
  } else {
    filePath = require.resolve(id, {
      paths: [join(importOptions.root, 'node_modules')]
    });
  }

  /**
   * Allow to ignore extension, default to .acss
   */
  if (extname(filePath) !== STYLE_EXT) {
    filePath = filePath + STYLE_EXT;
  }

  return filePath;
}

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
                  require('postcss-import')({ resolve: styleResolver }),
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
