const { join, resolve } = require('path');
const { readFileSync, existsSync } = require('fs');

const getAppConfig = exports.getAppConfig = function getAppConfig(projectDir) {
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

  const pages = {};
  let homepage = 'index';
  if (Array.isArray(appJSON.pages)) {
    appJSON.pages.forEach((pageSrc, idx) => {
      if (0 === idx) {
        homepage = pageSrc;
      }
      pages[pageSrc] = pageSrc;
    });
  } else {
    Object.keys(appJSON.pages).forEach((key, idx) => {
      const pageSrc = appJSON.pages[key];
      if (0 === idx) {
        homepage = key;
      }
      pages[key] = pageSrc;
    });
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
    tabBar.list = tabBar.items.map(item => {
      return {
        'pageName': item.pagePath,
        'text': item.name,
        'iconPath': item.icon,
        'selectedIconPath': item.activeIcon
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
};

function readJSONSync(p) {
  return JSON.parse(readFileSync(p, 'utf-8'));
}

exports.getPages = function getPages(projectDir) {
  return getAppConfig(projectDir).pages;
};
