'use strict';
const webpack = require('webpack');
const serverRender = require('rax-server-renderer');
const babelMerge = require('babel-merge');

const WeexFrameworkBanner = require('../../plugins/WeexFrameworkBannerPlugin');

const babelConfig = require('../babel.config');

const babelConfigWeex = babelMerge.all([{
  plugins: [
    require.resolve('rax-hot-loader/babel'),
  ],
}, babelConfig]);

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const getWebpackBase = require('../getWebpackBase');

module.exports = (context) => {
  const { rootDir } = context;

  const config = getWebpackBase(context);

  config.output.filename('weex/[name].js');

  config.resolve.alias
    .set('@core/app', 'universal-app-runtime')
    .set('@core/page', 'universal-app-runtime')
    .set('@core/router', 'universal-app-runtime');

  config.module.rule('jsx')
    .test(/\.(js|mjs|jsx)$/)
    .exclude
      .add(/(node_modules|bower_components)/)
      .end()
    .use('babel')
      .loader(require.resolve('babel-loader'))
      .options(babelConfigWeex);

  config.module.rule('tsx')
    .test(/\.tsx?$/)
    .exclude
      .add(/(node_modules|bower_components)/)
      .end()
    .use('babel')
      .loader(require.resolve('babel-loader'))
      .options(babelConfigWeex)
      .end()
    .use('ts')
      .loader(require.resolve('ts-loader'));

  config.module.rule('css')
    .test(/\.css?$/)
    .use('css')
      .loader(require.resolve('stylesheet-loader'))

  config.module.rule('assets')
    .test(/\.(svg|png|webp|jpe?g|gif)$/i)
    .use('source')
      .loader(require.resolve('image-source-loader'));

  if (process.env.ANALYZER) {
    config.plugin('analyze')
      .use(BundleAnalyzerPlugin);
  }

  config.plugin('weexFrame')
    .use(WeexFrameworkBanner);

  config.plugin('noError')
    .use(webpack.NoEmitOnErrorsPlugin);

  return config;
};
