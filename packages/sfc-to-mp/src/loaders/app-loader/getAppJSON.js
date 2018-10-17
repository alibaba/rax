const { existsSync, readFileSync } = require('fs');
const { getOption } = require('../../config/cliOptions');

module.exports = function getAppJSON(manifestPath) {
  if (!existsSync(manifestPath)) {
    throw new Error('manifest.json not exists');
  }
  const targetType = getOption('target');
  const appJSON = JSON.parse(readFileSync(manifestPath, 'utf-8'));

  const pages = appJSON.pages;
  const tabBar = appJSON.tabBar;

  if (tabBar && Object.keys(tabBar).length > 0) {
    const tabBarList = tabBar.list;
    // 生成 tabBar 数据
    // 支付宝与微信的处理方式不一致
    if (targetType === 'ali') {
      // @see https://docs.alipay.com/mini/framework/app
      delete tabBar.list;
      tabBar.items = tabBarList.map((item) => {
        return {
          name: item.text,
          pagePath: item.pagePath || pages[item.pageName], // TODO 小程序与轻框架兼容
          icon: item.iconPath,
          activeIcon: item.selectedIconPath,
        };
      });
    } else if (targetType === 'wx') {
      // @see https://developers.weixin.qq.com/miniprogram/dev/framework/config.html#%E5%85%A8%E5%B1%80%E9%85%8D%E7%BD%AE
      tabBar.list = tabBarList.map((item) => {
        return {
          text: item.text,
          pagePath: item.pagePath || pages[item.pageName],
          // iconPath: item.iconPath, // FIXME  微信小程序暂不支持网路图
          // selectedIconPath: item.selectedIconPath,
        };
      });
    }
  }

  // 转换 pagePaths 的路径
  appJSON.pages = Object.values(pages);

  return appJSON;
};
