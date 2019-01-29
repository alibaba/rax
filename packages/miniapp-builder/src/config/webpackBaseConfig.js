const webpack = require('webpack');

const cwd = process.cwd();
const tsLoader = require.resolve('ts-loader');

module.exports = {
  devServer: {
    stats: {
      children: false,
      modules: false,
      chunks: false,
    },
    host: '0.0.0.0',
  },
  resolve: {
    modules: ['node_modules', cwd],
    extensions: ['.js', '.json', '.ts', '.html', '.sfc'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: tsLoader,
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
