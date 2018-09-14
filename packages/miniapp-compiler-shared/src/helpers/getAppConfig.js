const { join, resolve } = require('path');
const { readFileSync, existsSync } = require('fs');

function getAppConfig(projectDir) {
  const manifestFilePath = join(projectDir, 'manifest.json');
  const appDotJSONFilePath = join(projectDir, 'app.json');
  const appJSON = {};

  if (existsSync(manifestFilePath)) {
    Object.assign(appJSON, readJSONSync(manifestFilePath));
  } else if (existsSync(appDotJSONFilePath)) {
    Object.assign(appJSON, readJSONSync(appDotJSONFilePath));
  } else {
    throw new Error('不存在以下文件: app.json | manifest.json');
  }

  const pages = [];
  let homepage = 'index'; // default homepage
  if (Array.isArray(appJSON.pages)) {
    for (let i = 0; i < appJSON.pages.length; i++) {
      const pageName = appJSON.pages[i];

      if (i === 0) homepage = pageName;

      const pageConfig = { pageName };
      // merge page config json
      const independentPageConfigPath = resolve(projectDir, pageName + '.json');
      if (existsSync(independentPageConfigPath)) {
        Object.assign(pageConfig, JSON.parse(readFileSync(independentPageConfigPath)));
      }

      pages.push(pageConfig);
    }
  } else if (typeof appJSON.pages === 'object') {
    const pageKeys = Object.keys(appJSON.pages);
    for (let i = 0; i < pageKeys.length; i++) {
      const pageName = pageKeys[i];
      const pagePath = appJSON.pages[pageName];

      if (i === 0) homepage = pageName;

      const pageConfig = { pageName, pagePath };
      // merge page config json
      const independentPageConfigPath = resolve(projectDir, pagePath + '.json');
      if (existsSync(independentPageConfigPath)) {
        Object.assign(pageConfig, JSON.parse(readFileSync(independentPageConfigPath)));
      }

      pages.push(pageConfig);
    }
  }

  const result = {
    pages,
    homepage,
    experimentalRemoteRenderer: appJSON.experimentalRemoteRenderer || null,
  };

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

  return result;
}

exports.getAppConfig = getAppConfig;

function readJSONSync(p) {
  return JSON.parse(readFileSync(p, 'utf-8'));
}

/**
 * return String[] list of pages
 */
exports.getPages = function getPages(projectDir) {
  return getAppConfig(projectDir).pages;
};
