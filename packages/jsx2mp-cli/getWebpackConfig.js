const webpack = require('webpack');
const { readJSONSync } = require('fs-extra');
const { join, relative, dirname } = require('path');
const chalk = require('chalk');
const RuntimeWebpackPlugin = require('./plugins/runtime');
const spinner = require('./utils/spinner');
const moduleResolve = require('./utils/moduleResolve');
const platformConfig = require('./utils/platformConfig');

const AppLoader = require.resolve('jsx2mp-loader/src/app-loader');
const PageLoader = require.resolve('jsx2mp-loader/src/page-loader');
const ComponentLoader = require.resolve('jsx2mp-loader/src/component-loader');
const ScriptLoader = require.resolve('jsx2mp-loader/src/script-loader');
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
      require.resolve('@babel/plugin-proposal-export-default-from'),
      require.resolve('@babel/plugin-proposal-class-properties'),
    ],
  };
}

function getEntry(type, cwd, entryFilePath, options) {
  const entryPath = dirname(entryFilePath);
  const entry = {};
  const { platform = 'ali' } = options;

  let loaderParams = JSON.stringify({
    platform: platformConfig[platform],
    entryPath: entryFilePath
  });

  if (type === 'project') {
    let appConfig = null;
    try {
      appConfig = readJSONSync(join(cwd, entryPath, 'app.json'));
    } catch (err) {
      console.log(err);
      console.error('Can not found app.json in current work directory, please check.');
      process.exit(1);
    }
    entry.app = AppLoader + '?' + JSON.stringify({ entryPath }) + '!./' + join(entryPath, 'app.js');
    if (Array.isArray(appConfig.routes)) {
      appConfig.routes.forEach(({ source, component }) => {
        component = source || component;
        entry['page@' + component] = PageLoader + '?' + loaderParams + '!' + getDepPath(component, entryPath);
      });
    } else if (Array.isArray(appConfig.pages)) {
      // Compatible with pages.
      appConfig.pages.forEach((pagePath) => {
        entry['page@' + pagePath] = PageLoader + '?' + loaderParams + '!' + getDepPath(pagePath, entryPath);
      });
    }
  }
  if (type === 'component') {
    entry.component = ComponentLoader + '?' + loaderParams + '!' + entryFilePath;
  }
  return entry;
}

/**
 * ./pages/foo -> based on src, return original
 * /pages/foo -> based on rootContext
 * pages/foo -> based on src, add prefix: './'
 */
function getDepPath(path, rootContext) {
  if (path[0] === '.' || path[0] === '/') {
    return join(rootContext, path);
  } else {
    return `./${rootContext}/${path}`;
  }
}

const cwd = process.cwd();

module.exports = (options = {}) => {
  let { entryPath, type, workDirectory, distDirectory, platform = 'ali', mode } = options;
  if (entryPath[0] !== '.') entryPath = './' + entryPath;
  entryPath = moduleResolve(workDirectory, entryPath, '.js') || moduleResolve(workDirectory, entryPath, '.jsx') || entryPath;
  const relativeEntryFilePath = './' + relative(workDirectory, entryPath); // src/app.js   or src/mobile/index.js

  return {
    mode: 'production', // Will be fast
    entry: getEntry(type, cwd, relativeEntryFilePath, options),
    output: {
      path: distDirectory
    },
    target: 'node',
    context: cwd,
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: [
            {
              loader: ScriptLoader,
              options: {
                mode: options.mode,
                entryPath: relativeEntryFilePath,
                platform: platformConfig[platform]
              },
            },
            {
              loader: BabelLoader,
              options: getBabelConfig(),
            }
          ]
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.webp$/],
          loader: FileLoader,
          options: {
            entryPath: relativeEntryFilePath
          },
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
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: mode === 'build' ? '"production"' : '"development"',
        }
      }),
      new RuntimeWebpackPlugin({ platform }),
      new webpack.ProgressPlugin( (percentage, message) => {
        if (percentage === 0) {
          buildStartTime = Date.now();
          spinner.start('Compiling...');
        } else if (percentage === 1) {
          const endTime = Date.now();
          spinner.succeed(`${chalk.green('Successfully compiled!')}\n\nCost: [${endTime - buildStartTime}ms]`);
        }
      })
    ],
  };
};
