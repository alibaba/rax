const path = require('path');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');

const mpLoader = require.resolve('../../index');

module.exports = function compile(fixture) {
  const context = path.resolve(__dirname, '../fixtures', fixture);
  const config = {
    mode: 'development',
    context,
    entry: {
      app: path.resolve(context, 'app.js'),
    },
    devtool: false, // 'cheap-eval-source-map',
    output: {
      path: path.resolve(__dirname, '../output'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /app\.js$/,
          loader: mpLoader,
        },
      ],
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
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
    ],
  };
  const compiler = webpack(config);
  compiler.outputFileSystem = new MemoryFS();

  return new Promise((resolve, reject) =>
    compiler.run((error, stats) => {
      if (error) {
        reject(error);
      }
      return resolve(stats);
    })
  );
};
