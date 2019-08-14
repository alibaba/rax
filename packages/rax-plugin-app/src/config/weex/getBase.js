'use strict';

const path = require('path');
const WeexFrameworkBanner = require('../../plugins/WeexFrameworkBannerPlugin');
const getWebpackBase = require('../getWebpackBase');

const UNIVERSAL_APP_SHELL_LOADER = require.resolve('universal-app-shell-loader');

module.exports = (context) => {
  const { rootDir } = context;
  const appEntry = path.resolve(rootDir, 'src/app.js');

  const config = getWebpackBase(context);

  config.output.filename('weex/[name].js');
  config.entry('index')
    .add(`${UNIVERSAL_APP_SHELL_LOADER}?type=weex!${appEntry}`);

  config.plugin('weexFrame')
    .use(WeexFrameworkBanner);

  return config;
};
