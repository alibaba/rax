'use strict';
const path = require('path');
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

  config.plugin('weexFrame')
    .use(WeexFrameworkBanner);

  config.module.rule('css')
    .test(/\.css?$/)
    .use('css')
      .loader(require.resolve('stylesheet-loader'));

  setUserConfig(config, context, 'weex');

  return config;
};
