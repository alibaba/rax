/**
 * Navigation
 */
export default class Navigation {
  constructor(router, tabbar) {
    this.router = router;
    this.tabbar = tabbar;
  }

  navigateTo(params) {
    this.router.navigateTo({ pageName: params.url });
    this.tabbar.hideTabBar();
  }

  navigateBack(params) {
    this.router.navigateBack(params);
    if (this.router.currentClient.isTab) {
      this.tabbar.showTabBar();
    }
  }

  redirectTo(params) {
    this.router.redirectTo({ pageName: params.url });
    this.tabbar.hideTabBar();
  }
}
