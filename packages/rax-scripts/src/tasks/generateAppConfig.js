const { writeFile } = require('fs');
const { join } = require('path');
const { frameworkVersion } = require('miniapp-compiler-shared');

let fwVersion = '0.0.14';
if (typeof frameworkVersion === 'string') {
  fwVersion = frameworkVersion;
}

module.exports = function(destDir, appConfig) {
  return (done) => {
    const pages = [];

    Object.keys(appConfig.pages).forEach((pageName) => {
      const item = {
        pageName,
        pageUrl: `https://g.alicdn.com/miniapp/framework/${fwVersion}/native/renderer.html`,
      };

      if (appConfig.experimentalRemoteRenderer) {
        item.pageUrl = appConfig.experimentalRemoteRenderer;
        console.log(
          'Miniapp Framework(renderer) DEBUG url: ' +
            appConfig.experimentalRemoteRenderer,
        );
      } else {
        console.log('Miniapp Framework(renderer) Version: ' + fwVersion);
      }

      pages.push(item);
    });

    appConfig.pages = pages;
    appConfig.appType = 'webview';
    appConfig.sdkVersion = '2'; // 客户端最低支持版本号

    const appConfigJSONPath = join(destDir, 'app.config.json');
    const appConfigJSONContent = JSON.stringify(appConfig, null, 2);
    writeFile(appConfigJSONPath, appConfigJSONContent, 'utf-8', done);
  };
};
