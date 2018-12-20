const path = require('path');
const address = require('address');
const ejs = require('ejs');
const axios = require('axios');
const { existsSync } = require('fs');

const { getAppConfig } = require('../../config/getAppConfig');
const { getMaster, getMasterView, FRAMEWORK_VERSION } = require('../../config/getFrameworkCDNUrl');

let cachedMasterView = null;

module.exports = async function masterRoute(ctx, next) {
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

  const frameworkVersion = appConfig.frameworkVersion || FRAMEWORK_VERSION;
  const type = ctx.request.url === '/app/index.html' ? 'web' : 'ide';

  const masterPath = getMaster(frameworkVersion, type);
  const masterViewPath = getMasterView(frameworkVersion, type);

  const hasInjectApi = existsSync(path.resolve(ctx.projectDir, 'api.js'));
  const injectApiScript = `<script src="http://${address.ip()}:${ctx.port}/build/api.js"></script>`;

  if (!cachedMasterView) {
    try {
      const response = await axios(masterViewPath);
      cachedMasterView = response.data;
    } catch (err) {
      console.error(err);
      ctx.body = err;
    }
  }

  appConfig.homepage =
    ctx.query.wml_path || ctx.query.homepage || appConfig.homepage;
  appConfig.h5Assets = `http://${address.ip()}:${ctx.port}/build/app.web.js`;

  try {
    const content = ejs.render(cachedMasterView, {
      appConfig: JSON.stringify(appConfig, null, 2),
      h5Master: masterPath,
      injectApi: hasInjectApi ? injectApiScript : ''
    });

    ctx.body = content;
  } catch (err) {
    ctx.body = err;
  }
};
