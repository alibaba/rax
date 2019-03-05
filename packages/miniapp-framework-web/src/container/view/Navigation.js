/**
 * Navigation
 */
export default class Navigation {
  constructor(router, tabbar) {
    this.router = router;
    this.tabbar = tabbar;
  }

  navigateTo(params) {
    this.router.navigateTo(params);
  }

  navigateBack(params) {
    this.router.navigateBack(params);
  }

  redirectTo(params) {
    this.router.redirectTo(params);
  }
}
