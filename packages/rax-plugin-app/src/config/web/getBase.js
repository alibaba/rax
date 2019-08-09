'use strict';
const webpack = require('webpack');
const serverRender = require('rax-server-renderer');
const babelMerge = require('babel-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const UniversalDocumentPlugin = require('../../plugins/UniversalDocumentPlugin');
const PWAAppShellPlugin = require('../../plugins/PWAAppShellPlugin');
const babelConfig = require('../babel.config');

let babelConfigWeb = babelMerge.all([{}, babelConfig]);

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const getWebpackBase = require('../getWebpackBase');

module.exports = (context) => {
  const { rootDir, userConfig } = context;

  const config = getWebpackBase(context);

  config.output.filename('web/[name].js');

  config.resolve.alias
    .set('@core/app', 'universal-app-runtime')
    .set('@core/page', 'universal-app-runtime')
    .set('@core/router', 'universal-app-runtime');

  if (userConfig.inlineStyle) {
    babelConfigWeb = babelMerge.all([{
      plugins: [
        require.resolve('babel-plugin-transform-jsx-stylesheet')
      ],
    }, babelConfigWeb]);

    config.module.rule('css')
      .test(/\.css?$/)
      .use('css')
        .loader(require.resolve('stylesheet-loader'));
  } else {
    // extract css file in web
    config.module.rule('css')
      .test(/\.css?$/)
      .use('minicss')
        .loader(MiniCssExtractPlugin.loader)
        .end()
      .use('csss')
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

    config.plugin('minicss')
      .use(MiniCssExtractPlugin, [{
        filename: 'web/[name].css',
        chunkFilename: 'web/[name].css',
      }]);
  }

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
      isMultiPageWebApp: userConfig.spa === false,
      rootDir,
      path: 'src/document/index.jsx',
      render: serverRender.renderToString,
    }]);

  config.plugin('PWAAppShell')
    .use(PWAAppShellPlugin, [{
      isMultiPageWebApp: userConfig.spa === false,
      rootDir,
      path: 'src/shell/index.jsx',
      render: serverRender.renderToString,
    }]);

  config.plugin('noError')
    .use(webpack.NoEmitOnErrorsPlugin);

  return config;
};
