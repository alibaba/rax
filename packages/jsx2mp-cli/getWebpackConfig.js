const webpack = require('webpack');
const { readJSONSync } = require('fs-extra');
const { join, relative, dirname } = require('path');
const chalk = require('chalk');
const RuntimeWebpackPlugin = require('./plugins/runtime');
const spinner = require('./utils/spinner');
const { multipleModuleResolve } = require('./utils/moduleResolve');
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
      [require.resolve('@babel/preset-react'), {
        'throwIfNamespace': false
      }]
    ],
    plugins: [
      [require.resolve('@babel/plugin-transform-typescript'), {
        isTSX: true,
        jsxPragma: 'Rax'
      }],
      require.resolve('@babel/plugin-proposal-export-default-from'),
      require.resolve('@babel/plugin-proposal-class-properties'),
    ],
  };
}

function getEntry(type, cwd, entryFilePath, options) {
  const entryPath = dirname(entryFilePath);
  const entry = {};
  const { platform = 'ali', constantDir, mode, disableCopyNpm, turnOffSourceMap } = options;

  const loaderParams = {
    platform: platformConfig[platform],
    entryPath: entryFilePath,
    constantDir,
    mode,
    disableCopyNpm,
    turnOffSourceMap
  };

  if (type === 'project') {
    let appConfig = null;
    try {
      appConfig = readJSONSync(join(cwd, entryPath, 'app.json'));
    } catch (err) {
      console.log(err);
      console.error('Can not found app.json in current work directory, please check.');
      process.exit(1);
    }
    entry.app = AppLoader + '?' + JSON.stringify({ entryPath, platform: platformConfig[platform], mode, disableCopyNpm, turnOffSourceMap }) + '!./' + entryFilePath;
    if (Array.isArray(appConfig.routes)) {
      appConfig.routes.filter(({ targets }) => {
        return !Array.isArray(targets) || targets.indexOf('miniapp') > -1;
      }).forEach(({ source, component, window = {} }) => {
        component = source || component;
        entry['page@' + component] = PageLoader + '?' + JSON.stringify(Object.assign({ pageConfig: window }, loaderParams)) + '!' + getDepPath(component, entryPath);
      });
    } else if (Array.isArray(appConfig.pages)) {
      // Compatible with pages.
      appConfig.pages.forEach((pagePath) => {
        entry['page@' + pagePath] = PageLoader + '?' + JSON.stringify(loaderParams) + '!' + getDepPath(pagePath, entryPath);
      });
    }
  }
  if (type === 'component') {
    entry.component = ComponentLoader + '?' + JSON.stringify(loaderParams) + '!' + entryFilePath;
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
  let { entryPath, type, workDirectory, distDirectory, platform = 'ali', mode, constantDir, disableCopyNpm, turnOffSourceMap } = options;
  if (entryPath[0] !== '.') entryPath = './' + entryPath;
  entryPath = multipleModuleResolve(workDirectory, entryPath, ['.js', '.jsx', '.ts', '.tsx']) || entryPath;
  const relativeEntryFilePath = './' + relative(workDirectory, entryPath); // src/app.js   or src/mobile/index.js

  const config = {
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
          test: /\.t|jsx?$/,
          use: [
            {
              loader: ScriptLoader,
              options: {
                mode: options.mode,
                entryPath: relativeEntryFilePath,
                platform: platformConfig[platform],
                constantDir,
                disableCopyNpm,
                turnOffSourceMap
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
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      mainFields: ['main', 'module']
    },
    externals: [
      function(context, request, callback) {
        if (/^@core\//.test(request)) {
          return callback(null, `commonjs2 ${request}`);
        }
        if (/\.(css|sass|scss|styl|less)$/.test(request)) {
          return callback(null, `commonjs2 ${request}`);
        }
        if (/^@weex-module\//.test(request)) {
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
      new webpack.ProgressPlugin( (percentage, message) => {
        if (percentage === 0) {
          buildStartTime = Date.now();
          spinner.start(`[${platformConfig[platform].name}] Compiling...`);
        } else if (percentage === 1) {
          const endTime = Date.now();
          spinner.succeed(`${chalk.green('Successfully compiled!')}\n\nCost: [${endTime - buildStartTime}ms]`);
        }
      })
    ],
  };

  if (!disableCopyNpm) {
    config.plugins.push(new RuntimeWebpackPlugin({ platform, mode }));
  }
  return config;
};
