import cache from '../util/cache';

let pageUrlRouteMap = null;

class Miniprogram {
  constructor(pageId) {
    this.$_pageId = pageId;
  }

  get window() {
    return cache.getWindow(this.$_pageId) || null;
  }

  get document() {
    return cache.getDocument(this.$_pageId) || null;
  }

  get config() {
    return cache.getConfig();
  }

  /**
     * 需要匹配对应路由的 route
     */
  getMatchRoute(pathname) {
    const keys = Object.keys(pageUrlRouteMap);
    for (const key of keys) {
      const matchRes = pageUrlRouteMap[key](pathname);

      if (matchRes) return matchRes; // 匹配成功
    }

    return null;
  }

  /**
     * 判断是否 tabBar 页面
     */
  isTabBarPage(pageRoute) {
    const {
      runtime = {}
    } = cache.getConfig();
    const tabBarMap = runtime.tabBarMap || {};
    return !!tabBarMap[pageRoute];
  }
}

export default Miniprogram;
