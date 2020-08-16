'use strict';

const path = require('path');
const webpack = require('webpack');
const uppercamelcase = require('uppercamelcase');
const RaxPlugin = require('rax-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const fs = require('fs');

// build packages
const PACKAGES_NAME = 'packages';
const PACKAGES_DIR = path.resolve(__dirname, `../${PACKAGES_NAME}`);
const babelOptions = require('./config/getBabelConfig')();

let packageList = fs.readdirSync(PACKAGES_DIR);
let buildinObj = {};

packageList.map((item) => {
  buildinObj[item] = item;
});

fs.readdirSync(PACKAGES_DIR).forEach(function(packageName) {
  creatBuildinModules(packageName, PACKAGES_DIR, PACKAGES_NAME);
});

function creatBuildinModules(packageName, dirpath, dirname) {
  var main = path.join(dirpath, packageName + '/src/index.js');
  var entryName = packageName.split('-')[1];
  var globalName = uppercamelcase(packageName);

  if (
    !/^(mobx|rax|universal)-/.test(packageName) ||
    /webpack/.test(packageName) ||
    /cli/.test(packageName) ||
    /loader/.test(packageName) ||
    /rax-test-renderer/.test(packageName) ||
    /rax-scripts/.test(packageName) ||
    !fs.existsSync(main)
  ) {
    console.log('Ignore service dist', packageName);
    return;
  }

  // read package.json
  let packagesJsonStr = fs.readFileSync(dirpath + '/' + packageName + '/package.json').toString();
  let packagesJson = JSON.parse(packagesJsonStr);

  // build service
  var serviceEntry = {};
  serviceEntry[entryName + '.service'] = serviceEntry[entryName + '.service.min'] = main;
  dist(getConfig(
    serviceEntry,
    {
      path: `./${dirname}/${packageName}/dist/`,
      filename: '[name].js',
      pathinfo: false,
    },
    {
      externalBuiltinModules: true,
      builtinModules: Object.assign({
        mobx: ['mobx'],
        redux: ['redux']
      }, RaxPlugin.BuiltinModules),
      moduleName: packageName,
      globalName: globalName,
      version: packagesJson.version,
    },
    babelOptions, null, null, true
  )).catch(function(err) {
    setTimeout(function() {
      throw err;
    });
  });
}

function getConfig(entry, output, moduleOptions, babelLoaderQuery, target, devtool, buildService) {
  // Webpack need an absolute path
  output.path = path.resolve(__dirname, '..', output.path);

  if (buildService) {
    buildinObj.rax = 'rax';
    moduleOptions.builtinModules = buildinObj;
    moduleOptions.externalBuiltinModules = true;
    moduleOptions.sourcePrefix = function(source, chunk, hash) {
      let moduleName = moduleOptions.moduleName;
      let serviceName = moduleOptions.moduleName + '_' + moduleOptions.version.split('.').join('_');
      serviceName = serviceName.split('-').join('_');
      return `service.register(options.serviceName, {
  create: function(id, env, config) {
    return {
      ${serviceName}: function(weex) {
        return {
          init : function(define, defineName, window) {
            for (var key in window) {
              eval('var ' + key + ' = window.' + key + ';');
            }
            ;(function(fn) {
              if ("object" == typeof exports && "undefined" != typeof module) module.exports = fn();
              else if ("function" == typeof define) {
                define("${moduleName}", [], function(require, exports, module) {
                    module.exports = fn();
                });
              } else {
                var o;
                o = "undefined" != typeof window ? window: "undefined" != typeof self ? self: "undefined" != typeof global ? global: this,
                o.${serviceName} = fn()
              }
            })(function(){
              return `;
    };
    moduleOptions.sourceSuffix = function(source, chunk, hash) {
      return ` });
          }
        }
      }
    }
  }
})`;
    };
  }

  return {
    mode: 'production',
    target: target || 'node',
    devtool: buildService ? '' : devtool || 'source-map',
    optimization: {
      minimize: false
    },
    stats: {
      optimizationBailout: true,
    },
    entry: entry,
    output: output,
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      new webpack.NoEmitOnErrorsPlugin(),
      new RaxPlugin(moduleOptions),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new UglifyJSPlugin({
        include: /\.min\.js$/,
        sourceMap: buildService ? false : true
      })
    ],
    module: {
      rules: [{
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
        options: babelLoaderQuery
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'stylesheet-loader'
          }
        ],
      }]
    }
  };
}

function dist(config) {
  return new Promise(function(resolver, reject) {
    let compiler = webpack(config);
    compiler.run(function(err, stats) {
      let options = {
        colors: true,
        chunks: false,
        errorDetails: true,
      };
      console.log(stats.toString(options));
      resolver();
    });
  });
}
