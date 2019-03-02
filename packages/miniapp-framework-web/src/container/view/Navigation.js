export default class Navigation {
  constructor(router, tabbar) {
    this.router = router;
    this.tabbar = tabbar;
  }

  navigateTo(params) {
    const isInTabbar = this.tabbar.check(params);
    if (isInTabbar) {
      this.tabbar.switchTab(params);
    } else {
      this.router.navigateTo(params);
    }
  }

  navigateBack(params) {
    history.back(params);
  }

  redirectTo(params) {
    this.router.redirectTo(params);
  }
}