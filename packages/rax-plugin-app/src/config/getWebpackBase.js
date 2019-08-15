const path = require('path');
const Chain = require('webpack-chain');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { setBabelAlias } = require('rax-compile-config');

module.exports = (context) => {
  const { rootDir, userConfig } = context;
  const { publicPath, outputDir } = userConfig;

  const config = new Chain();

  config.target('web');
  config.context(rootDir);

  setBabelAlias(config);

  config.resolve.extensions
    .merge(['.js', '.json', '.jsx', '.html', '.ts', '.tsx']);

  // external weex module
  config.externals([
    function(ctx, request, callback) {
      if (request.indexOf('@weex-module') !== -1) {
        return callback(null, 'commonjs ' + request);
      }
      callback();
    }
  ]);

  config.output
    .path(path.resolve(rootDir, outputDir))
    .filename('[name].js')
    .publicPath(publicPath);

  config.plugin('caseSensitivePaths')
    .use(CaseSensitivePathsPlugin);

  return config;
};
