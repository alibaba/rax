const path = require('path');
const { readFileSync } = require('fs');
const address = require('address');
const { getAppConfig } = require('../../config/getAppConfig');

const localIP = address.ip();
const containerFilePath = path.resolve(__dirname, '../views/ide.container.html');

module.exports = function masterRoute(ctx, next) {
  /**
   * Declear assets to load plugins
   *   pluginAssets: Array[URL<String>]
   * Each url will be loaded asynchronously or synchronously before app.js.
   */
  const pluginAssets = [];
  if (ctx.miniappType === 'plugin') {
    pluginAssets.push(`http://${localIP}:${ctx.port}/build-plugin/index.js`);
  }

  const appConfig = getAppConfig(ctx.projectDir, {
    pluginAssets,
  });

  appConfig.homepage =
    ctx.query.wml_path || ctx.query.homepage || appConfig.homepage;
  appConfig.h5Assets = `http://${address.ip()}:${ctx.port}/build/app.js`;

  const tpl = readFileSync(containerFilePath, 'utf-8');
  ctx.body = tpl.replace('__app_config__', JSON.stringify(appConfig, null, 2));
};
