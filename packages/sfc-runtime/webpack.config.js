const webpack = require('webpack');

const config = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    'sfc-runtime': require.resolve('./src')
  },
  output: {
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: [
            require('babel-preset-env'),
            require('babel-preset-stage-0')
          ]
        }
      }
    ]
  },
  externals: [
    function (context, request, callback) {
      if (/^@core\//.test(request)) {
        return callback(null, `${request}`);
      }
      callback();
    }
  ],
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      )
    })
  ],
  devServer: {
    port: 8005,
    hot: false,
    inline: false
  }
};

module.exports = new Promise((resolve, reject) => {
  resolve(config);
});
