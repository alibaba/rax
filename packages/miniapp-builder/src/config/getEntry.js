const { resolve } = require('path');
const getMiniappType = require('./getMiniappType');
const { getPages } = require('./getAppConfig');

const mpLoaderPath = require.resolve('mp-loader');

/**
 * 获取 webpack entry
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
      entry[pageName] = resolve(projectDir, pagePath);
    });
  } else if (miniappType === 'mp') {
    const appFilePath = resolve(projectDir, 'app.js');

    /* app entry */
    entry.app = `!!${mpLoaderPath}?type=ali!${appFilePath}`;
  }

  return entry;
};
