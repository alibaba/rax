'use strict';

const WeexFrameworkBanner = require('../../plugins/WeexFrameworkBannerPlugin');
const getWebpackBase = require('../getWebpackBase');

module.exports = (context) => {
  const config = getWebpackBase(context);

  config.output.filename('weex/[name].js');

  config.plugin('weexFrame')
    .use(WeexFrameworkBanner);

  return config;
};
