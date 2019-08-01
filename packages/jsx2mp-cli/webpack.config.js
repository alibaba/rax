const { readJSONSync } = require('fs-extra');
const { join } = require('path');
const AppLoader = require.resolve('jsx2mp-loader/src/app-loader');
const PageLoader = require.resolve('jsx2mp-loader/src/page-loader');
const ComponentLoader = require.resolve('jsx2mp-loader/src/component-loader');
const FileLoader = require.resolve('jsx2mp-loader/src/file-loader');

const BabelLoader = require.resolve('babel-loader');

function getBabelConfig() {
  return {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: [
      '@babel/plugin-proposal-class-properties'
    ],
  }
}

function getEntry(appConfig) {
  const entry = {};
  entry['app'] = AppLoader + '!./app.js';
  if (Array.isArray(appConfig.routes)) {
    appConfig.routes.forEach(({ path, component }) => {
      entry['page@' + component] = PageLoader + '!' + getDepPath(component);
    })
  }
  return entry;
}

/**
 * ./pages/foo -> based on src, return original
 * /pages/foo -> based on rootContext
 * pages/foo -> based on src, add prefix: './'
 */
function getDepPath(path, rootContext = '') {
  if (path[0] === '.') {
    return path;
  } else if (path[0] === '/') {
    return join(rootContext, path);
  } else {
    return './' + path;
  }
}

const cwd = process.cwd();
let appConfig;

try {
  appConfig = readJSONSync(join(cwd, 'app.json'));
} catch (err) {
  console.log(err)
  console.error('Can not found app.json in current work directory, please check.');
  process.exit(1);
}

module.exports = {
  mode: 'development',
  entry: getEntry(appConfig),
  context: cwd,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: FileLoader
          },
          {
            loader: BabelLoader,
            options: getBabelConfig(),
          }
        ]
      }
    ],
  },
  externals: [
    function (context, request, callback) {
      if (/^@core\//.test(request)) {
        return callback(null, `commonjs2 ${request}`);
      }
      if (/\.css$/.test(request)) {
        return callback(null, `commonjs2 ${request}`);
      }
      callback();
    },
  ],
}