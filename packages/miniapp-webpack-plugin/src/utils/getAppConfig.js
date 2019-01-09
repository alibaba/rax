const { join, resolve } = require('path');
const { readFileSync, existsSync } = require('fs');
const { getNativeRendererUrl, FRAMEWORK_VERSION } = require('./getFrameworkCDNUrl');

const EXTERNAL_PAGE_URL_REG = /^https?:\/\//;
const DEFAULT_CONFIG = {
  /**
   * Native appType for setting container type
   */
  appType: 'webview',
  /**
   * Native SDK Version means API level
   * if not satisfied, will notify upgrade
   * for users. must be a typeof string.
   */
  sdkVersion: '2',
};

/**
 * Get configuration for app.
 */
const getAppConfig = exports.getAppConfig = function getAppConfig(projectDir, opts = {}) {
  const manifestFilePath = join(projectDir, 'manifest.json');
  const appDotJSONFilePath = join(projectDir, 'app.json');
  const appJSON = Object.assign({}, DEFAULT_CONFIG);

  if (existsSync(manifestFilePath)) {
    Object.assign(appJSON, readJSONSync(manifestFilePath));
  } else if (existsSync(appDotJSONFilePath)) {
    Object.assign(appJSON, readJSONSync(appDotJSONFilePath));
  } else {
    console.error('Cannot find one of following files: app.json | manifest.json');
    return null;
  }

  const nativeRendererUrl = getNativeRendererUrl(
    appJSON.frameworkVersion || FRAMEWORK_VERSION
  );

  const pages = [];
  let homepage = 'index'; // default homepage
  if (Array.isArray(appJSON.pages)) {
    for (let i = 0; i < appJSON.pages.length; i++) {
      const pageName = appJSON.pages[i];

      if (i === 0) homepage = pageName;

      let pageUrl;

      if (EXTERNAL_PAGE_URL_REG.test(pageName)) {
        pageUrl = pageName;
      } else if (opts && opts.pageUrl) {
        pageUrl = opts.pageUrl;
      } else {
        pageUrl = nativeRendererUrl;
      }

      const pageConfig = {
        pageName,
        pageUrl
      };

      // Merge page config json to `window` property.
      const independentPageConfigPath = resolve(projectDir, pageName + '.json');
      if (existsSync(independentPageConfigPath)) {
        const independentPageConfig = JSON.parse(readFileSync(independentPageConfigPath));
        Object.assign(pageConfig, independentPageConfig);
      }

      pages.push(pageConfig);
    }
  } else if (typeof appJSON.pages === 'object') {
    const pageKeys = Object.keys(appJSON.pages);
    for (let i = 0; i < pageKeys.length; i++) {
      const pageName = pageKeys[i];
      const pagePath = appJSON.pages[pageName];

      if (i === 0) homepage = pageName;

      let pageUrl;

      if (EXTERNAL_PAGE_URL_REG.test(pageName)) {
        pageUrl = pageName;
      } else if (opts && opts.pageUrl) {
        pageUrl = opts.pageUrl;
      } else {
        pageUrl = nativeRendererUrl;
      }

      const pageConfig = {
        pageName,
        pagePath,
        pageUrl,
      };
      // Merge page config json
      const independentPageConfigPath = resolve(projectDir, pagePath + '.json');
      if (existsSync(independentPageConfigPath)) {
        Object.assign(pageConfig, JSON.parse(readFileSync(independentPageConfigPath)));
      }

      pages.push(pageConfig);
    }
  }

  const result = Object.assign({}, appJSON, {
    pages,
    homepage,
  });

  let tabBar = {};
  if (appJSON.tabBar) {
    Object.assign(tabBar, appJSON.tabBar);
  }

  if (tabBar.textColor) {
    tabBar.color = tabBar.textColor;
    delete tabBar.textColor;
  }

  if (Array.isArray(tabBar.items)) {
    tabBar.list = tabBar.items.map((item) => {
      return {
        pageName: item.pagePath,
        text: item.name,
        iconPath: item.icon,
        selectedIconPath: item.activeIcon,
      };
    });
    delete tabBar.items;
  }

  if (appJSON.window) {
    result.window = appJSON.window;
  }

  // h5Pages 指定 webview 的白名单
  if (appJSON.h5Pages) {
    result.h5Pages = appJSON.h5Pages;
  }

  result.tabBar = tabBar;

  /**
   * Add plugin definition to app config.
   */
  if (opts.pluginAssets) {
    result.pluginAssets = opts.pluginAssets;
  }

  // 自定义 api
  if (appJSON.externalApi) {
    result.externalApi = appJSON.externalApi;
  }
  return result;
};

/**
 * Get JS Object from filename.
 */
function readJSONSync(filename) {
  return JSON.parse(readFileSync(filename, 'utf-8'));
}

/**
 * Get list of page names.
 */
exports.getPages = function getPages(projectDir) {
  return getAppConfig(projectDir).pages;
};
