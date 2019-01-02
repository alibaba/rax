const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const ejs = require('ejs');
const axios = require('axios');
const {
  getH5MasterView,
  FRAMEWORK_VERSION
} = require('../../config/getFrameworkCDNUrl');

/**
 * build web version of miniapp
 * @param {*} appConfig
 */
module.exports = function buildWeb(destDir, appConfig) {
  return done => {
    let frameworkVersion;
    if (appConfig.frameworkVersion) {
      frameworkVersion = appConfig.frameworkVersion;
    } else {
      frameworkVersion = FRAMEWORK_VERSION;
    }

    const frameworkMasterURL = getH5MasterView(frameworkVersion);

    axios(frameworkMasterURL).then(response => {
      appConfig.h5Assets = '/build/app.web.js';

      const webDistFileContent = [
        '__register_pages__(function(require){',
        readFileSync(join(destDir, 'app.js'), 'utf-8'),
        '});'
      ].join('\n');
      const webDistFilePath = join(destDir, 'app.web.js');
      writeFileSync(webDistFilePath, webDistFileContent, 'utf-8');

      const htmlFileContent = ejs.render(response.data, {
        appConfig: JSON.stringify(appConfig)
      });
      const htmlFilePath = join(destDir, 'index.html');
      writeFileSync(htmlFilePath, htmlFileContent, 'utf-8');
      done();
    });
  };
};
