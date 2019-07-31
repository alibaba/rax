'use strict';
const _ = require('lodash');
const webpack = require('webpack');
const serverRender = require('rax-server-renderer');
const babelMerge = require('babel-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const UniversalDocumentPlugin = require('../../plugins/UniversalDocumentPlugin');
const babelConfig = require('../babel.config');

const babelConfigWeb = babelMerge.all([{
  plugins: [require.resolve('rax-hot-loader/babel')],
}, babelConfig]);

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const getWebpackBase = require('../getWebpackBase');

module.exports = () => {
  const config = getWebpackBase();

  config.output.filename('[name].js');

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
      .options(babelConfigWeb);

  config.module.rule('tsx')
    .test(/\.tsx?$/)
    .exclude
      .add(/(node_modules|bower_components)/)
      .end()
    .use('babel')
      .loader(require.resolve('babel-loader'))
      .options(babelConfigWeb)
      .end()
    .use('ts')
      .loader(require.resolve('ts-loader'));
  
  config.module.rule('css')
    .test(/\.css?$/)
    .use('minicss')
      .loader(MiniCssExtractPlugin.loader)
      .end()
    .use('css')
      .loader(require.resolve('css-loader'))
      .end()
    .use('postcss')
      .loader(require.resolve('postcss-loader'))
      .options({
        ident: 'postcss',
        plugins: () => [
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
          require('postcss-plugin-rpx2vw')(),
        ],
      });
  
  config.module.rule('assets')
    .test(/\.(svg|png|webp|jpe?g|gif)$/i)
    .use('source')
      .loader(require.resolve('image-source-loader'));

  if (process.env.ANALYZER) {
    config.plugin('analyze')
      .use(BundleAnalyzerPlugin);
  }

  config.plugin('document')
    .use(UniversalDocumentPlugin, [{
      render: serverRender.renderToString,
    }]);

  config.plugin('minicss')
    .use(MiniCssExtractPlugin, [{
      filename: '[name].css',
      chunkFilename: '[id].css',
    }]);

  config.plugin('noError')
    .use(webpack.NoEmitOnErrorsPlugin);
  
  return config;
};
