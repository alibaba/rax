const _ = require('lodash');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (config, context, value, target) => {
  if (target === 'web' && !value) {
    // extract css file in web while inlineStyle is false
    config.module.rule('css').clear();
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

    config.module.rule('jsx')
      .use('babel')
        .tap((options) => removeBabelPlugin(options));

    config.module.rule('tsx')
      .use('babel')
        .tap((options) => removeBabelPlugin(options));

    config.plugin('minicss')
      .use(MiniCssExtractPlugin, [{
        filename: 'web/[name].css',
        chunkFilename: 'web/[name].css',
      }]);
  }
};

function removeBabelPlugin(config) {
  config.plugins = config.plugins.filter(v => {
    let name = v;
    if (_.isArray(v)) {
      name = v[0];
    }

    return !_.includes(name, 'babel-plugin-transform-jsx-stylesheet');
  });

  return config;
}
