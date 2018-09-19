const { writeFileSync } = require('fs');
const { join } = require('path');

const DEFAULT_EXTRA_CONFIG = {
  appType: 'webview', // thirdparty miniapp type
  sdkVersion: '2' // native sdk version
};
const CONFIG_FILENAME = 'app.config.json';

/**
 * build config for miniapp
 * @param {*} destDir
 * @param {*} appConfig
 */
module.exports = function (destDir, appConfig) {


  return done => {

    Object.assign(appConfig, DEFAULT_EXTRA_CONFIG);

    const appConfigJSONPath = join(destDir, CONFIG_FILENAME);
    const appConfigJSONContent = JSON.stringify(appConfig, null, 2) + '\n';
    writeFileSync(appConfigJSONPath, appConfigJSONContent, 'utf-8');
    done();
  };
};
