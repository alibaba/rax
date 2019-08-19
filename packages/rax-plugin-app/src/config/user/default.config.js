module.exports = {
  inlineStyle: true,
  outputDir: 'build',
  publicPath: '/',
  devPublicPath: '/',
  devServer: {
    compress: true,
    disableHostCheck: true,
    clientLogLevel: 'error',
    historyApiFallback: true,
    hot: true,
    quiet: true,
    overlay: false,
    host: '0.0.0.0',
    port: 9999,
  }
};
