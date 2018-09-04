const Jszip = require('jszip');
const { getAppConfig } = require('miniapp-compiler-shared');
const address = require('address');

/**
 * write bundle.zip
 */
module.exports = function bundleCtrl(ctx, next) {
  const zip = new Jszip();

  const appJSON = getAppConfig(ctx.projectDir);
  if (!Array.isArray(appJSON.pages)) {
    /**
     * 将对象格式的 pages 列表转换成数组格式
     */
    appJSON.pages = Object.keys(appJSON.pages || {}).map((pageName) => {
      return {
        pageName,
      };
    });
  }

  appJSON.pages.forEach((item) => {
    item.pageUrl = ctx.isDebug
      ? `http://${address.ip()}:8003/native/renderer.html`
      : appJSON.experimentalRemoteRenderer ||
        'https://g.alicdn.com/miniapp/framework/0.0.17/native/renderer.html';
  });

  /* 指定首页 */
  appJSON.homepage =
    ctx.query.wml_path ||
    ctx.query.homepage ||
    appJSON.homepage ||
    appJSON.pages[0].pageName;
  /* 指定渲染类型, 客户端使用 */
  appJSON.appType = 'webview';

  zip.file('app.config.json', JSON.stringify(appJSON, null, 2));
  zip.file('app.js', global.APPJSContent);
  // stream mode output

  ctx.body = zip.generateNodeStream({
    type: 'nodebuffer',
    streamFiles: true,
    compression: 'DEFLATE',
    compressionOptions: {
      level: 9,
    },
  });
};
