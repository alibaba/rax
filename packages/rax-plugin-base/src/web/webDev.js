'use strict';

const path = require('path');
const address = require('address');

// const hmrClient = require.resolve('../../hmr/webpackHotDevClient.entry');
const UNIVERSAL_APP_SHELL_LOADER = require.resolve('universal-app-shell-loader');

module.exports = (webConfig) => {
  const appEntry = path.resolve(process.cwd(), 'src/app.js');
  const appPublic = path.resolve(process.cwd(), 'public');

  webConfig.mode('development');
  webConfig.devtool('inline-module-source-map');
  // webConfig.entry('index.web')
  //   .add(hmrClient)
  //   .add(`${UNIVERSAL_APP_SHELL_LOADER}?type=web!${pathConfig.universalAppEntry}`);
  
  webConfig.entry('index.web')
    .add(`${UNIVERSAL_APP_SHELL_LOADER}?type=web!${appEntry}`);

  // const weexConfig = _.cloneDeep(config);
  const publicPath = '/';

  webConfig.devServer
    .compress(true)
    .clientLogLevel('error')
    .contentBase(appPublic)
    .watchContentBase(true)
    .hot(true)
    .quiet(true)
    .publicPath(publicPath)
    .overlay(false)
    .host(address.ip())
    .public(address.ip())
    .watchOptions({
      ignored: /node_modules/,
    });
}
