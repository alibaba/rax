'use strict';
const path = require('path');
const RaxWebpackPlugin = require('rax-webpack-plugin');
const WeexFrameworkBanner = require('../../plugins/WeexFrameworkBannerPlugin');
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
    .filename('weex/[name].js');

  config.plugin('raxWebpack')
    .use(RaxWebpackPlugin, [{
      target: 'bundle',
      externalBuiltinModules: false
    }]);

  config.plugin('weexFrame')
    .use(WeexFrameworkBanner);

  setUserConfig(config, context, 'weex');

  return config;
};
