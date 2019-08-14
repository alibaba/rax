const address = require('address');

module.exports = {
  inlineStyle: true,
  outputDir: 'build',
  publicPath: '/',
  devPublicPath: '/',
  devServer: {
    compress: true,
    clientLogLevel: 'error',
    historyApiFallback: true,
    hot: true,
    quiet: true,
    overlay: false,
    host: address.ip(),
    port: 9999,
  }
};
