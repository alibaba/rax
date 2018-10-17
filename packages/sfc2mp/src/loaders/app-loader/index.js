const { readFileSync, existsSync } = require('fs');
const { resolve } = require('path');

const getAppJSON = require('./getAppJSON');
const getExt = require('../../config/getExt');
const { OUTPUT_SOURCE_FOLDER, OUTPUT_VENDOR_FOLDER } = require('../../config/CONSTANTS');

module.exports = function appLoader(content) {
  /**
   * handle with app.json
   */

  const manifestPath = resolve(this.rootContext, 'manifest.json');

  this.addDependency(manifestPath);

  const appJSON = getAppJSON(manifestPath);

  this.emitFile('app.json', JSON.stringify(appJSON, null, 2) + '\n');

  content = content + '\nmodule.exports = app;';
  this.emitFile(
    `${OUTPUT_SOURCE_FOLDER}/app.js`,
    content.replace(/@core\/app/, `../${OUTPUT_VENDOR_FOLDER}/coreApp.js`)
  );

  /**
   * handle with app.css
   */
  const appCSSPath = resolve(this.rootContext, 'app.css');
  if (existsSync(appCSSPath)) {
    this.addDependency(appCSSPath);
    const styleContent = readFileSync(appCSSPath, 'utf-8');
    this.emitFile('app' + getExt('style'), styleContent);
  }

  /**
   * handle with app.js
   */
  const source = `
  var createApp = require('./${OUTPUT_VENDOR_FOLDER}/createApp');
  var appConfig = require('./${OUTPUT_SOURCE_FOLDER}/app');
  App(createApp(appConfig));
`;
  this.callback(null, source);
};
