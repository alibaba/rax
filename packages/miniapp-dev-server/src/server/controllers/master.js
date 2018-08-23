const { resolve } = require('path');
const ejs = require('ejs');
const { getAppConfig } = require('miniapp-compiler-shared');
const address = require('address');

const masterViewPath = resolve(__dirname, '../../views/master.ejs');

module.exports = function masterRoute(ctx, next) {
  const appConfig = getAppConfig(ctx.projectDir);

  let h5MasterJS = 'https://g.alicdn.com/miniapp/framework/0.0.13/h5/master.js';
  if (ctx.isDebug) {
    h5MasterJS = `http://${address.ip()}:8003/h5/master.js`;
  }

  appConfig.homepage =
    ctx.query.wml_path || ctx.query.homepage || appConfig.homepage;
  appConfig.h5Assets = `http://${address.ip()}:${ctx.port}/build/app.js`;

  ejs.renderFile(
    masterViewPath,
    {
      appConfig: JSON.stringify(appConfig, null, 2),
      h5MasterJS,
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
