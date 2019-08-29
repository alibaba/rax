'use strict';

const WeexFrameworkBanner = require('../../plugins/WeexFrameworkBannerPlugin');
const getWebpackBase = require('../getWebpackBase');
const setEntry = require('../setEntry');
const setUserConfig = require('../user/setConfig');

module.exports = (context) => {
  const config = getWebpackBase(context);
  setEntry(config, context, 'weex');

  config.output.filename('weex/[name].js');

  config.plugin('weexFrame')
    .use(WeexFrameworkBanner);

  setUserConfig(config, context, 'weex');

  return config;
};
