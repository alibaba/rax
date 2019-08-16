'use strict';
const webpack = require('webpack');
const path = require('path');
const address = require('address');
const Chain = require('webpack-chain');
const RaxWebpackPlugin = require('rax-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { getBabelConfig, setBabelAlias } = require('rax-compile-config');
const WeexFrameworkBanner = require('../../plugins/WeexFrameworkBannerPlugin');

const { hmrClient } = require('rax-compile-config');

module.exports = (context) => {
  const { rootDir, userConfig } = context;
  const { outputDir } = userConfig;

  const config = new Chain();

  const babelConfig = getBabelConfig({
    styleSheet: true,
    custom: {
      ignore: ['**/**/*.d.ts']
    }
  });

  config.target('web');
  config.context(rootDir);

  config.devtool('inline-module-source-map');

  config.entry('index')
    .add(hmrClient)
    .add(path.resolve(rootDir, 'demo/index'));

  config.resolve.alias
    .set('babel-runtime-jsx-plus', require.resolve('babel-runtime-jsx-plus'))
    // @babel/runtime has no index
    .set('@babel/runtime', path.dirname(require.resolve('@babel/runtime/package.json')));

  config.resolve.extensions
    .merge(['.js', '.json', '.jsx', '.html', '.ts', '.tsx']);

  // external weex module
  config.externals([
    function(_context, request, callback) {
      if (request.indexOf('@weex-module') !== -1) {
        return callback(null, 'commonjs ' + request);
      }
      callback();
    }
  ]);

  config.output
    .path(path.resolve(rootDir, outputDir))
    .filename('weex/[name].js')
    .publicPath('/');

  config.module.rule('jsx')
    .test(/\.(js|mjs|jsx)$/)
    .exclude
      .add(/(node_modules|bower_components)/)
      .end()
    .use('babel')
      .loader(require.resolve('babel-loader'))
      .options(babelConfig);

  config.module.rule('tsx')
    .test(/\.tsx?$/)
    .exclude
      .add(/(node_modules|bower_components)/)
      .end()
    .use('babel')
      .loader(require.resolve('babel-loader'))
      .options(babelConfig)
      .end()
    .use('ts')
      .loader(require.resolve('ts-loader'));

  config.module.rule('css')
    .test(/\.css?$/)
    .use('css')
      .loader(require.resolve('stylesheet-loader'));

  config.module.rule('assets')
    .test(/\.(svg|png|webp|jpe?g|gif)$/i)
    .use('source')
      .loader(require.resolve('image-source-loader'));

  config.plugin('caseSensitivePaths')
    .use(CaseSensitivePathsPlugin);

  config.plugin('raxWebpack')
    .use(RaxWebpackPlugin, [{
      target: 'bundle',
      externalBuiltinModules: false
    }]);

  config.plugin('weexFrame')
    .use(WeexFrameworkBanner);

  config.plugin('noError')
    .use(webpack.NoEmitOnErrorsPlugin);

  const appPublic = path.resolve(rootDir, 'public');

  config.devServer
    .compress(true)
    .clientLogLevel('error')
    .contentBase(appPublic)
    .watchContentBase(true)
    .hot(true)
    .quiet(true)
    .publicPath('/')
    .overlay(false)
    .host(address.ip())
    .public(address.ip());

  return config;
};
