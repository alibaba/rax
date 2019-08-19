const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const RaxWebpackPlugin = require('rax-webpack-plugin');
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

  config.plugin('raxWebpack')
    .use(RaxWebpackPlugin, [{
      target: 'bundle',
      externalBuiltinModules: false
    }]);

  config.plugin('html')
    .use(HtmlWebpackPlugin, [{
      inject: true,
      template: path.resolve(__dirname, '../demo.html')
    }]);

  setUserConfig(config, context, 'web');

  return config;
};
