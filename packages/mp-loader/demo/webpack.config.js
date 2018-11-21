const WebpackMiniProgramPlugin = require('./WebpackMiniProgramPlugin');

const cwd = process.cwd();
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
  entry: ['./app.js'],
  context: __dirname,
  module: {
    rules: [
      /**
       * Post babel loader to compile template attribute expression
       */
      {
        test: /\.(js|axml)$/,
        enforce: 'post',
        use: [
          {
            loader: 'babel-loader',
            options: babelConfig,
          }
        ]
      },
      {
        test: /\.acss$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1 // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('miniapp-builder/src/plugins/PostcssPluginRpx2rem'),
                require('miniapp-builder/src/plugins/PostcssPluginTagPrefix'),
                require('autoprefixer')
              ]
            }
          }
        ]
      },
      {
        test: /app\.js$/,
        use: [
          {
            loader: require.resolve('../')
          }
        ]
      },
    ]
  },
  externals: [
    function(context, request, callback) {
      if (/^@(core|schema)\//.test(request)) {
        return callback(null, `commonjs2 ${request}`);
      }
      callback();
    },
  ],
  plugins: [
    new WebpackMiniProgramPlugin(),
  ]
};
