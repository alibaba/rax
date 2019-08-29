const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const babelMerge = require('babel-merge');

module.exports = (config, context, value, target) => {
  // enbale inlineStyle
  if (target === 'weex' || value) {
    if (target === 'weex') {
      config.module.rule('css')
        .test(/\.css?$/)
        .use('css')
          .loader(require.resolve('stylesheet-loader'));
    }

    if (target === 'web') {
      config.module.rule('css')
        .test(/\.css?$/)
        .use('css')
          .loader(require.resolve('stylesheet-loader'))
          .end()
        .use('postcss')
          .loader(require.resolve('postcss-loader'))
          .options({
            ident: 'postcss',
            plugins: () => [
              require('postcss-plugin-rpx2vw')(),
            ],
          });
    }

    config.module.rule('jsx')
      .use('babel')
        .tap(opt => addStylePlugin(opt));

    config.module.rule('tsx')
      .use('babel')
        .tap(opt => addStylePlugin(opt));
  // disable inlineStyle
  } else if (target === 'web' && !value) {
    // extract css file in web while inlineStyle is disabled
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

    config.plugin('minicss')
      .use(MiniCssExtractPlugin, [{
        filename: 'web/[name].css',
      }]);
  }
};

function addStylePlugin(babelConfig) {
  return babelMerge.all([{
    plugins: [require.resolve('babel-plugin-transform-jsx-stylesheet')],
  }, babelConfig]);
}
