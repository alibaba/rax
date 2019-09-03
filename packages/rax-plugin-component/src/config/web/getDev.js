const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { hmrClient } = require('rax-compile-config');

const getBaseWebpack = require('../getBaseWebpack');
const setUserConfig = require('../user/setConfig');

module.exports = (context) => {
  const config = getBaseWebpack(context);
  const { rootDir } = context;

  config.entry('index')
    .add(hmrClient)
    .add(path.resolve(rootDir, 'demo/index'));

  config.output
    .filename('[name].js');

  config.module.rule('css')
    .test(/\.css?$/)
    .use('style')
      .loader(require.resolve('style-loader'))
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

  config.plugin('html')
    .use(HtmlWebpackPlugin, [{
      inject: true,
      template: path.resolve(__dirname, '../demo.html')
    }]);

  setUserConfig(config, context, 'web');

  return config;
};
