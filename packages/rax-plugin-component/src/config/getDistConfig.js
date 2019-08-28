const path = require('path');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const getBaseWebpack = require('./getBaseWebpack');
const setUserConfig = require('./user/setConfig');

module.exports = (context) => {
  const config = getBaseWebpack(context);

  const { rootDir } = context;

  config.target('web');

  config.entry('index')
    .add(path.resolve(rootDir, 'src/index'));

  config.externals(nodeExternals());

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
      filename: '[name].css',
    }]);

  setUserConfig(config, context, 'weex');

  return config;
};
