'use strict';

const path = require('path');
const webpack = require('webpack');
const RaxPlugin = require('rax-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const babelOptions = require('../babel.config')();

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
  {
    presets: ['@babel/preset-env'],
    plugins: [
      [
        "@babel/plugin-transform-runtime",
        {
          "corejs": false,
          "helpers": true,
          "regenerator": true,
          "useESModules": false
        }
      ]
    ]
  }
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

  dist(getConfig(
    {
      'driver.worker': './packages/driver-worker/src/index.js',
      'driver.worker.min': './packages/driver-worker/src/index.js',
      'driver.worker.renderer': './packages/driver-worker/src/renderer/index.js',
      'driver.worker.renderer.min': './packages/driver-worker/src/renderer/index.js',
    },
    {
      path: './packages/driver-worker/dist/',
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      pathinfo: false,
    },
    {
      // target: 'bundle',
      bundle: null,
      frameworkComment: '',
      libraryTarget: 'umd',
    },
    babelOptions
  ));
}).catch(function(err) {
  setTimeout(function() {
    throw err;
  });
});

function getConfig(entry, output, moduleOptions, babelLoaderQuery, target, devtool) {
  // Webpack need an absolute path
  output.path = path.resolve(__dirname, '..', output.path);

  return {
    mode: 'production',
    target: target || 'node',
    devtool: devtool || 'source-map',
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
        sourceMap: true
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
