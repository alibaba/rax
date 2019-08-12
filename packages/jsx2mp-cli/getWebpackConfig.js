const webpack = require('webpack');
const { readJSONSync } = require('fs-extra');
const { join, resolve, relative } = require('path');
const chalk = require('chalk');
const RuntimeWebpackPlugin = require('./plugins/runtime');
const spinner = require('./utils/spinner');
const moduleResolve = require('./utils/moduleResolve');

const AppLoader = require.resolve('jsx2mp-loader/src/app-loader');
const PageLoader = require.resolve('jsx2mp-loader/src/page-loader');
const ComponentLoader = require.resolve('jsx2mp-loader/src/component-loader');
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

function getEntry(type, cwd, entryPath) {
  const entry = {};
  
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
      appConfig.routes.forEach(({ path, component }) => {
        entry['page@' + component] = PageLoader + '?' + JSON.stringify({ entryPath }) +  '!' + getDepPath(component, entryPath);
      });
    } else if (Array.isArray(appConfig.pages)) {
      // Compatible with pages.
      appConfig.pages.forEach((pagePath) => {
        entry['page@' + pagePath] = PageLoader + '!' + getDepPath(pagePath, entryPath);
      });
    }
  }
  if (type === 'component') {
    entry.component = ComponentLoader + '?' + JSON.stringify({ entryPath }) + '!' + entryPath;
  }
  console.log('entry', entry);
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
    return `./${rootContext}${path}`;
  }
}

const cwd = process.cwd();

module.exports = (options = {}) => {
  const { entryPath, type, workDirectory } = options;
    let resolvedEntryPath = moduleResolve(workDirectory, entryPath, '.js') || moduleResolve(workDirectory, entryPath, '.jsx');
    let relativeEntryPath = relative(workDirectory, resolvedEntryPath);
    console.log("TCL: relativeEntryPath", relativeEntryPath)
  
  return {
    mode: 'production', // Will be fast
    entry: getEntry(type, cwd, entryPath),
    target: 'node',
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
                entryPath: entryPath
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
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"',
        }
      }),
      new RuntimeWebpackPlugin(),
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
  }
};
