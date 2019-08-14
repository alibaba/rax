const path = require('path');
const address = require('address');
const webpack = require('webpack');
const Chain = require('webpack-chain');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const RaxWebpackPlugin = require('rax-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { getBabelConfig, setBabelAlias } = require('rax-compile-config');

const { hmrClient } = require('rax-compile-config');

const babelConfig = getBabelConfig({
  styleSheet: true,
  custom: {
    ignore: ['**/**/*.d.ts']
  }
});

module.exports = (context) => {
  const { rootDir, userConfig } = context;
  const { outputDir } = userConfig;

  const config = new Chain();

  config.mode('development');
  config.context(rootDir);

  setBabelAlias(config);

  config.resolve.extensions
    .merge(['.js', '.json', '.jsx', '.html']);

  config.devtool('inline-module-source-map');
  config.entry('index')
    .add(hmrClient)
    .add(path.resolve(rootDir, 'demo/index'));

  config.output
    .path(path.resolve(rootDir, outputDir))
    .filename('[name].js')
    .publicPath('/');

  config.plugin('raxWebpack')
    .use(RaxWebpackPlugin, [{
      target: 'bundle',
      externalBuiltinModules: false
    }]);

  config.plugin('caseSensitivePaths')
    .use(CaseSensitivePathsPlugin);

  config.plugin('html')
    .use(HtmlWebpackPlugin, [{
      inject: true,
      template: path.resolve(__dirname, './demo.html')
    }]);

  config.plugin('noError')
    .use(webpack.NoEmitOnErrorsPlugin);

  config.module.rule('jsx')
    .test(/\.(js|mjs|jsx)$/)
    .exclude
      .add(/(node_modules|bower_components)/)
      .end()
    .use('babel')
      .loader(require.resolve('babel-loader'))
      .options(babelConfig);

  config.module.rule('css')
    .test(/\.css?$/)
    .use('css')
      .loader(require.resolve('stylesheet-loader'));

  config.module.rule('assets')
    .test(/\.(svg|png|webp|jpe?g|gif)$/i)
    .use('source')
      .loader(require.resolve('image-source-loader'));

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
