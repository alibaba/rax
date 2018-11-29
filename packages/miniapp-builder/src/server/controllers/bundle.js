const { join } = require('path');
const fs = require('fs');
const Jszip = require('jszip');
const glob = require('glob');
const { getAppConfig } = require('../../config/getAppConfig');
const { getNativeRendererUrl, FRAMEWORK_VERSION } = require('../../config/getFrameworkCDNUrl');

/**
 * Output bundle.zip
 */
module.exports = function bundleCtrl(ctx, next) {
  const zip = new Jszip();

  let pageUrl = getNativeRendererUrl(FRAMEWORK_VERSION);
  if (ctx.rendererUrl) {
    pageUrl = ctx.rendererUrl;
  }
  if (ctx.rendererInspect) {
    /**
     * Inspect url format of Weinre
     */
    const remoteInspectUrl = `http://${ctx.rendererInspectHost}:${ctx.rendererInspectPort}/target/target-script-min.js`;
    pageUrl += `?remoteInspectUrl=${encodeURIComponent(remoteInspectUrl)}`;
  }

  const appJSON = getAppConfig(ctx.projectDir, {
    pageUrl,
  });

  /* 指定首页, 兼容外部依赖 */
  appJSON.homepage = ctx.query.wml_path || ctx.query.homepage || appJSON.homepage || appJSON.pages[0].pageName;

  /* 指定渲染类型, 客户端必须指定 */
  appJSON.appType = 'webview';

  const globOpts = {
    cwd: ctx.projectDir,
    dot: true,
    nodir: true,
    ignore: '**/node_modules/**',
  };

  function zipFiles(fileList) {
    if (!Array.isArray(fileList)) return;
    for (let i = 0, len = fileList.length; i < len; i++) {
      zip.file(fileList[i], fs.readFileSync(join(ctx.projectDir, fileList[i])));
    }
  }

  // Pack image files
  const imageFiles = glob.sync('**/*.{png,jpg,gif,ico,webp,jpeg}', globOpts);
  zipFiles(imageFiles);

  // Pack includeFiles
  const { includeFiles } = appJSON;
  zipFiles(includeFiles);

  zip.file('app.config.json', JSON.stringify(appJSON, null, 2));
  zip.file('app.js', global.AppJSContent);

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
