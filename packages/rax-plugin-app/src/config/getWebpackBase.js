const path = require('path');
const webpack = require('webpack');
const Chain = require('webpack-chain');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

module.exports = (context) => {
  const { rootDir, userConfig, command } = context;
  const { publicPath, outputDir } = userConfig;

  const config = new Chain();

  config.target('web');
  config.context(rootDir);

  config.resolve.alias
    .set('babel-runtime-jsx-plus', require.resolve('babel-runtime-jsx-plus'))
    // @babel/runtime has no index
    .set('@babel/runtime', path.dirname(require.resolve('@babel/runtime/package.json')));

  config.resolve.extensions
    .merge(['.js', '.json', '.jsx', '.html', '.ts', '.tsx']);

  config.output
    .path(path.resolve(rootDir, outputDir))
    .filename('[name].js')
    .publicPath(publicPath);

  config.plugin('caseSensitivePaths')
    .use(CaseSensitivePathsPlugin);

  return config;
};
