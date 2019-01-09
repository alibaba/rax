const { resolve } = require('path');
const getMiniappType = require('./getMiniappType');
const { getPages } = require('./getAppConfig');

const PLUGIN_REG = /^plugin:\/\//;

/**
 * Get webpack entry
 * @param {String} projectDir 项目路径
 */
module.exports = function getEntry(projectDir) {
  const miniappType = getMiniappType(projectDir);
  const appPages = getPages(projectDir);
  const entry = {};

  if (miniappType === 'sfc') {
    /* app entry */
    entry.$app = resolve(projectDir, 'app.js');
    /* page entry */
    appPages.forEach(({ pagePath, pageName }) => {
      if (isPluginPage(pageName)) return;
      entry[pageName] = resolve(projectDir, pagePath);
    });
  } else if (miniappType === 'mp') {
    /* app entry */
    entry.app = resolve(projectDir, 'app.js');
  }

  return entry;
};

/**
 * Determin which page name is a plugin page.
 * @param pageName
 * @returns {boolean}
 */
function isPluginPage(pageName) {
  return PLUGIN_REG.test(pageName);
}
