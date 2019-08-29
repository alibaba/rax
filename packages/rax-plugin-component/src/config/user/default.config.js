const address = require('address');

module.exports = {
  inlineStyle: true,
  outputDir: 'lib',
  distDir: 'build',
  publicPath: '/',
  devPublicPath: '/',
  devServer: {
    compress: true,
    disableHostCheck: true,
    clientLogLevel: 'error',
    hot: true,
    quiet: true,
    overlay: false,
    host: address.ip(),
    port: 9999,
  }
};
