const path = require('path');
const address = require('address');
const ejs = require('ejs');
const { getAppConfig } = require('../../config/getAppConfig');
const { getH5Master, FRAMEWORK_VERSION } = require('../../config/getFrameworkCDNUrl');

const localIP = address.ip();
const masterTemplateFilePath = path.resolve(__dirname, '../views/master.ejs');

module.exports = function masterRoute(ctx, next) {
  const appConfig = getAppConfig(ctx.projectDir, {
    pluginAssets: [
      `http://${localIP}:${ctx.port}/build-plugin/index.js`,
    ],
  });
  let h5Master = getH5Master(appConfig.frameworkVersion || FRAMEWORK_VERSION);

  if (ctx.isDebug) {
    h5Master = `http://${localIP}:8003/h5/master.js`;
  }

  appConfig.homepage =
    ctx.query.wml_path || ctx.query.homepage || appConfig.homepage;
  appConfig.h5Assets = `http://${address.ip()}:${ctx.port}/build/app.web.js`;

  /**
   * Declear assets to load plugins
   *   pluginAssets: Array[URL<String>]
   * Each url will be loaded asynchronously or synchronously before app.js.
   */
  // appConfig.pluginAssets = [
  //   // 'http://192.168.31.42:9988/build/plugin.js',
  // ];

  ejs.renderFile(
    masterTemplateFilePath,
    {
      appConfig: JSON.stringify(appConfig, null, 2),
      h5Master,
    },
    {},
    (err, str) => {
      if (err) {
        ctx.body = err;
      } else {
        ctx.body = str;
      }
    },
  );
};
