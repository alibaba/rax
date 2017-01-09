'use strict';

const path = require('path');
const webpack = require('webpack');
const RaxPlugin = require('rax-webpack-plugin');
const fs = require('fs');

// For babelHelpers.js build
if (!fs.existsSync('./packages/rax/build')) {
  fs.mkdirSync('./packages/rax/build');
}

[
  ['rax-components', 'components', 'Components'],
  ['rax-redux', 'redux', 'RaxRedux'],
  ['rax-animated', 'animated', 'Animated'],
  ['universal-panresponder', 'panresponder', 'PanResponder'],
  ['universal-platform', 'platform', 'Platform'],
  ['universal-stylesheet', 'stylesheet', 'StyleSheet'],
  ['universal-toast', 'toast', 'Toast'],
  ['universal-jsonp', 'jsonp', 'JSONP']
].forEach(function(info) {
  var main = './packages/' + info[0] + '/src/index.js';
  var entry = {};
  entry[info[1]] = entry[info[1] + '.min'] = entry[info[1] + '.factory'] = main;
  dist(getConfig(
    entry,
    {
      path: './packages/' + info[0] + '/dist/',
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      pathinfo: false,
    },
    {
      externalBuiltinModules: true,
      builtinModules: Object.assign({
        'rax-components': ['rax-components']
      }, RaxPlugin.BuiltinModules),
      moduleName: info[0],
      globalName: info[2],
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
      presets: ['es2015', 'rax'],
      plugins: [
        ['transform-helper', {
          helperFilename: './packages/rax/build/babelHelpers.js'
        }]
      ],
      ignore: [
        'babelHelpers.js'
      ]
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
      sourceMapFilename: '[name].map',
      pathinfo: false,
    },
    {
      // Empty
    },
    {
      presets: ['es2015']
    }
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
      target: 'bundle'
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
});

function getConfig(entry, output, moduleOptions, babelLoaderQuery, target) {
  return {
    target: target || 'node',
    devtool: 'source-map',
    entry: entry,
    output: output,
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      new webpack.NoErrorsPlugin(),
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
        loader: 'babel', // 'babel-loader' is also a legal name to reference
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
