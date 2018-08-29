const webpack = require('webpack');

const cwd = process.cwd();

module.exports = {
  devServer: {
    stats: {
      children: false,
      modules: false,
      chunks: false
    },
    host: '0.0.0.0'
  },
  resolve: {
    modules: [
      'node_modules',
      cwd,
    ],
    extensions: ['.js', '.html', '.json']
  },
  output: {
    // show at devtool console panel
    devtoolModuleFilenameTemplate: '[resource-path]'
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
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.ProvidePlugin({
      my: [require.resolve('my-api-compat'), 'default'],
    }),
  ]
};