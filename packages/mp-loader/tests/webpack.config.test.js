process.env.BABEL_ENV = 'test';
const path = require('path');
const webpack = require('webpack'); /* eslint-disable-line */
const Wrapper = require('./webpack-plugin-wraper');

const context = process.cwd();

const babelConfig = {
  babelrc: false,
  presets: [
    require.resolve('@babel/preset-env')
  ],
  plugins: [
    // Stage 0
    '@babel/plugin-proposal-function-bind',

    // Stage 1
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-logical-assignment-operators',
    ['@babel/plugin-proposal-optional-chaining', { 'loose': false }],
    ['@babel/plugin-proposal-pipeline-operator', { 'proposal': 'minimal' }],
    ['@babel/plugin-proposal-nullish-coalescing-operator', { 'loose': false }],
    '@babel/plugin-proposal-do-expressions',

    // Stage 2
    ['@babel/plugin-proposal-decorators', { 'legacy': true }],
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',

    // Stage 3
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    ['@babel/plugin-proposal-class-properties', { 'loose': false }],
    '@babel/plugin-proposal-json-strings'
  ]
};

module.exports = {
  mode: 'development',
  devtool: false,
  context,
  module: {
    rules: [
      {
        test: /specs\/.*\.js$/,
        use: [{
          loader: require.resolve('babel-loader'),
          options: babelConfig
        }, {
          loader: require.resolve('../loader/page'),
          options: {
            type: 'my',
          }
        }],
        include: [
          context
        ],
        exclude: [
          path.join(__dirname, 'test.js')
        ]
      },
      {
        test: /\.js$/,
        use: [{
          loader: require.resolve('babel-loader'),
          options: babelConfig
        }]
      },
    ]
  },
  resolve: {
    modules: [
      'node_modules',
      context,
    ],
  },
  externals: [
    function(context, request, callback) {
      if (/^@(core|schema)\//.test(request)) {
        return callback(null, `commonjs2 ${request}`);
      }
      callback();
    }
  ],
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"testing"'
    }),
    new Wrapper({
      header(fileName, entry) {
        return 'var rax = getRax(); (function(require) {';
      },
      footer(fileName, entry) {
        return `})(function _require(mod) {
          if (mod === '@core/page') {
            return {
              register(pageInfo, factory) {
                var cont = document.createElement('div');
                document.body.appendChild(cont);
                cont.setAttribute('data-id', pageInfo.page);
                
                var module = { exports: null };
                factory(module, module.exports, _require);
                var page = module.exports || 'view';
                rax.render(rax.createElement(page), cont);
              }
            }
          } else if (mod === '@core/context') {
            return {};
          } else if (mod === '@core/rax') {
            return rax;
          }
          return null;
        });`;
      }
    })
  ]
};
