'use strict';
console.log('dist packages')
const path = require('path');
const webpack = require('webpack');
const uppercamelcase = require('uppercamelcase');
const RaxPlugin = require('rax-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const fs = require('fs');

const PACKAGES_NAME = 'packages';
const PACKAGES_DIR = path.resolve(__dirname, `../${PACKAGES_NAME}`);

const PACKAGES2_NAME = 'components';
const PACKAGES2_DIR = path.resolve(__dirname, `../${PACKAGES2_NAME}`);

const babelOptions = require('../babel.config')();

const GLOBAL_NAME = {
  'rax-dom': 'RaxDOM',
};


let packages = fs.readdirSync(PACKAGES_DIR);
let packages2 = fs.readdirSync(PACKAGES2_DIR);
let buildinObj = {};
packages.map((item) => {
  buildinObj[item] = item;
})
packages2.map((item) => {
  buildinObj[item] = item;
})

function normalizeGlobalName(name) {
  return GLOBAL_NAME[name] || uppercamelcase(name);
}

fs.readdirSync(PACKAGES_DIR)
  .forEach(function(packageName) {
    var main = path.join(PACKAGES_DIR, packageName + '/src/index.js');

    if (
      !/^(mobx|rax|universal)-/.test(packageName) ||
      /webpack/.test(packageName) ||
      /cli/.test(packageName) ||
      /loader/.test(packageName) ||
      /rax-test-renderer/.test(packageName) ||
      /rax-scripts/.test(packageName) ||
      !fs.existsSync(main)
    ) {
      console.log('Ignore dist', packageName);
      return;
    }

    var entryName = packageName.split('-')[1];
    var globalName = normalizeGlobalName(packageName);

    var entry = {};
    entry[entryName] = entry[entryName + '.min'] = entry[entryName + '.factory'] = main;
    dist(getConfig(
      entry,
      {
        path: './packages/' + packageName + '/dist/',
        filename: '[name].js',
        sourceMapFilename: '[name].map',
        pathinfo: false,
      },
      {
        externalBuiltinModules: true,
        builtinModules: RaxPlugin.BuiltinModules,
        moduleName: packageName,
        globalName: globalName,
      },
      babelOptions
    ));
    
    // read package.json
    let packagesJsonStr = fs.readFileSync(PACKAGES_DIR + '/' + packageName + '/package.json').toString();
    let packagesJson = JSON.parse(packagesJsonStr);

    // build service
    var serviceEntry = {};
    serviceEntry[entryName + '.service'] = serviceEntry[entryName + '.service.min'] = main;
    dist(getConfig(
      serviceEntry,
      {
        path: './packages/' + packageName + '/dist/',
        filename: '[name].js',
        // sourceMapFilename: '[name].map',
        pathinfo: false,
      },
      {
        externalBuiltinModules: true,
        builtinModules: RaxPlugin.BuiltinModules,
        moduleName: packageName,
        globalName: globalName,
        version: packagesJson.version,
      },
      babelOptions, null, null, true
    ));
    
  });

dist(getConfig(
  {
    'rax': './packages/rax/src/index.js',
    'rax.min': './packages/rax/src/index.js',
    'rax.factory': './packages/rax/src/index.js',
  },
  {
    path: './packages/rax/dist/',
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    pathinfo: false,
  },
  {
    moduleName: 'rax',
    globalName: 'Rax',
    factoryGlobals: ['__weex_document__', 'document']
  },
  babelOptions
)).then(() => {
  return dist(getConfig(
    {
      'shared.function': './packages/runtime-shared/src/index.js',
    },
    {
      path: './packages/runtime-shared/dist/',
      filename: '[name].js',
      pathinfo: false,
    },
    {
      // Empty
    },
    {
      presets: ['@babel/preset-env']
    },
    null,
    'hidden-source-map'
  ));
}).then(() => {
  dist(getConfig(
    {
      'framework.web': './packages/web-rax-framework/src/index.js',
      'framework.web.min': './packages/web-rax-framework/src/index.js'
    },
    {
      path: './packages/web-rax-framework/dist/',
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      pathinfo: false,
    },
    {
      target: 'bundle',
      bundle: null,
      frameworkComment: '',
    },
    babelOptions
  ));

  dist(getConfig(
    {
      'framework.weex': './packages/weex-rax-framework/src/index.js'
    },
    {
      path: './packages/weex-rax-framework/dist/',
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      pathinfo: true,
    },
    {
      target: 'module'
    },
    babelOptions
  ));

  dist(getConfig(
    {
      'api.weex': './packages/weex-rax-framework-api/src/index.js'
    },
    {
      path: './packages/weex-rax-framework-api/dist/',
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      pathinfo: true,
    },
    {
      target: 'module'
    },
    babelOptions
  ));
}).catch(function(err) {
  setTimeout(function() {
    throw err;
  });
});

function getConfig(entry, output, moduleOptions, babelLoaderQuery, target, devtool, buildService) {
  // Webpack need an absolute path
  output.path = path.resolve(__dirname, '..', output.path);

  if (buildService) {
    buildinObj['rax'] = 'rax';
    moduleOptions.builtinModules = buildinObj;
    moduleOptions.externalBuiltinModules = true;
    moduleOptions.sourcePrefix = function(source, chunk, hash){
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
    moduleOptions.sourceSuffix = function(source, chunk, hash){
      return ` });
          }
        }
      }
    }
  }
})`;
    }
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
