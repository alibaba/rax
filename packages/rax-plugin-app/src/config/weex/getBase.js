'use strict';

const WeexFrameworkBanner = require('../../plugins/WeexFrameworkBannerPlugin');
const getWebpackBase = require('../getWebpackBase');
const setEntry = require('../setEntry');

module.exports = (context) => {
  const config = getWebpackBase(context);
  setEntry(config, context, 'weex');

  config.output.filename('weex/[name].js');

  config.plugin('weexFrame')
    .use(WeexFrameworkBanner);

  return config;
};
