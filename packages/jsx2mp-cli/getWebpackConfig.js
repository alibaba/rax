const webpack = require('webpack');
const { readJSONSync } = require('fs-extra');
const { join } = require('path');
const RuntimeWebpackPlugin = require('./plugins/runtime');
const spinner = require('./utils/spinner');

const AppLoader = require.resolve('jsx2mp-loader/src/app-loader');
const PageLoader = require.resolve('jsx2mp-loader/src/page-loader');
const FileLoader = require.resolve('jsx2mp-loader/src/file-loader');

const BabelLoader = require.resolve('babel-loader');
let buildStartTime;

function getBabelConfig() {
  return {
    presets: [
      require.resolve('@babel/preset-env'),
      require.resolve('@babel/preset-react'),
    ],
    plugins: [
      require.resolve('@babel/plugin-proposal-class-properties'),
    ],
  };
}

function getEntry(appConfig) {
  const entry = {};
  entry.app = AppLoader + '!./src/app.js';
  if (Array.isArray(appConfig.routes)) {
    appConfig.routes.forEach(({ path, component }) => {
      entry['page@' + component] = PageLoader + '!' + getDepPath(component);
    });
  } else if (Array.isArray(appConfig.pages)) {
    // Compatible with pages.
    appConfig.pages.forEach((pagePath) => {
      entry['page@' + pagePath] = PageLoader + '!' + getDepPath(pagePath);
    });
  }
  return entry;
}

/**
 * ./pages/foo -> based on src, return original
 * /pages/foo -> based on rootContext
 * pages/foo -> based on src, add prefix: './'
 */
function getDepPath(path, rootContext = 'src') {
  if (path[0] === '.' || path[0] === '/') {
    return join(rootContext, path);
  } else {
    return `./${rootContext}/${path}`;
  }
}

const cwd = process.cwd();
let appConfig;

try {
  appConfig = readJSONSync(join(cwd, 'src/app.json'));
} catch (err) {
  console.log(err);
  console.error('Can not found app.json in current work directory, please check.');
  process.exit(1);
}

module.exports = (options = {}) => ({
  mode: 'production', // will be fast
  entry: getEntry(appConfig),
  context: cwd,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: FileLoader,
            options: {
              mode: options.mode,
            },
          },
          {
            loader: BabelLoader,
            options: getBabelConfig(),
          }
        ]
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  externals: [
    function(context, request, callback) {
      if (/^@core\//.test(request)) {
        return callback(null, `commonjs2 ${request}`);
      }
      if (/\.css$/.test(request)) {
        return callback(null, `commonjs2 ${request}`);
      }
      callback();
    },
  ],
  plugins: [
    new RuntimeWebpackPlugin(),
    new webpack.ProgressPlugin( (percentage, message) => {
      if (percentage === 0) {
        buildStartTime = Date.now();
        spinner.start('Compiling...');
      } else if (percentage === 1) {
        const endTime = Date.now();
        spinner.succeed(`Compiled successfully!\n\nTime: [${endTime - buildStartTime}ms]`);
      }
    })
  ],
});
