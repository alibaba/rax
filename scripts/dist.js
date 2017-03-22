'use strict';

const path = require('path');
const webpack = require('webpack');
const uppercamelcase = require('uppercamelcase');
const RaxPlugin = require('rax-webpack-plugin');
const fs = require('fs');

[
  'rax-components',
  'rax-redux',
  'rax-animated',
  'rax-text',
  'rax-button',
  'rax-calendar',
  'rax-countdown',
  'rax-gotop',
  'rax-grid',
  'rax-icon',
  'rax-image',
  'rax-link',
  'rax-listview',
  'rax-modal',
  'rax-multirow',
  'rax-navigation',
  'rax-picture',
  'rax-player',
  'rax-recyclerview',
  'rax-refreshcontrol',
  'rax-scrollview',
  'rax-slider',
  'rax-switch',
  'rax-tabbar',
  'rax-tabheader',
  'rax-scrollview',
  'rax-textinput',
  'rax-touchable',
  'rax-video',
  'rax-view',
  'universal-panresponder',
  'universal-easing',
  'universal-perf',
  'universal-transition',
  'universal-platform',
  'universal-stylesheet',
  'universal-toast',
  'universal-jsonp'
].forEach(function(packageName) {

  var entryName = packageName.split('-')[1];
  var globalName = uppercamelcase(packageName);
  var main = './packages/' + packageName + '/src/index.js';
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
    {
      presets: ['es2015', 'rax']
    }
  ));
});

dist(getConfig(
  {
    'env': './packages/universal-env/src/index.js',
    'env.min': './packages/universal-env/src/index.js',
    'env.factory': './packages/universal-env/src/index.js',
  },
  {
    path: './packages/universal-env/dist/',
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    pathinfo: false,
  },
  {
    moduleName: 'universal-env',
    globalName: 'Env',
  },
  {
    presets: ['es2015', 'rax']
  }
)).then(() => {
  return dist(getConfig(
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
    {
      presets: ['es2015', 'rax']
    }
  ));
}).then(() => {
  return dist(getConfig(
    {
      'transition': './packages/universal-transition/src/index.js',
      'transition.min': './packages/universal-transition/src/index.js',
      'transition.factory': './packages/universal-transition/src/index.js',
    },
    {
      path: './packages/universal-transition/dist/',
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      pathinfo: false,
    },
    {
      moduleName: 'universal-transition',
      globalName: 'Transition',
    },
    {
      presets: ['es2015', 'rax']
    }
  ));
}).then(() => {
  return dist(getConfig(
    {
      'promise.module': './packages/runtime-shared/src/promise.js',
      'promise.function': './packages/runtime-shared/src/promise.js',
      'matchMedia.module': './packages/runtime-shared/src/matchMedia.js',
      'matchMedia.function': './packages/runtime-shared/src/matchMedia.js',
      'url.module': './packages/runtime-shared/src/url.js',
      'url.function': './packages/runtime-shared/src/url.js',
      'url-search-params.module': './packages/runtime-shared/src/url-search-params.js',
      'url-search-params.function': './packages/runtime-shared/src/url-search-params.js',
      'fontface.module': './packages/runtime-shared/src/fontface.js',
      'fontface.function': './packages/runtime-shared/src/fontface.js'
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
      presets: ['es2015']
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
    {
      presets: ['es2015'],
      ignore: [
        'dist/'
      ]
    }
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
    {
      presets: ['es2015'],
      ignore: [
        'dist/'
      ]
    }
  ));
}).catch(function(err){
  setTimeout(function(){
    throw err;
  });
});

function getConfig(entry, output, moduleOptions, babelLoaderQuery, target, devtool) {
  // Webpack need an absolute path
  output.path = path.resolve(__dirname, '..', output.path);
  return {
    target: target || 'node',
    devtool: devtool || 'source-map',
    entry: entry,
    output: output,
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      new webpack.NoEmitOnErrorsPlugin(),
      new RaxPlugin(moduleOptions),
      new webpack.optimize.UglifyJsPlugin({
        include: /\.min\.js$/,
        minimize: true,
        compress: {
          warnings: false
        }
      })
    ],
    module: {
      loaders: [{
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
        query: babelLoaderQuery
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
