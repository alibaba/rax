export default class Tabbar {
  constructor(options = {}) {
    this.mainEl = options.mainEl;
    this.tabBarEl = options.tabBarEl;
  }

  showTabBar() {
    if (!this.tabBarEl) {
      return;
    }

    this.tabBarEl.style.display = 'flex';
    this.mainEl.style.bottom = '12.8vw';
  }

  hideTabBar() {
    if (!this.tabBarEl) {
      return;
    }

    this.tabBarEl.style.display = 'none';
    this.mainEl.style.bottom = '0px';
  }

  setTabBarBadge(params) {
    if (!this.tabBarEl) {
      return;
    }

    const items = this.tabBarEl.children;
    const item = items[params.index];

    const prevBadge = item.querySelector('.badge');
    if (prevBadge) {
      prevBadge.innerHTML = params.text;
    } else {
      const badge = document.createElement('div');
      badge.setAttribute('class', 'badge');
      badge.innerHTML = params.text;
      item.appendChild(badge);
    }
  }

  removeTabBarBadge(params) {
    if (!this.tabBarEl) {
      return;
    }

    const items = this.tabBarEl.children;
    const item = items[params.index];

    const prevBadge = item.querySelector('.badge');
    if (prevBadge) {
      prevBadge.remove();
    }
  }

  showTabBarRedDot(params) {
    if (!this.tabBarEl) {
      return;
    }

    const items = this.tabBarEl.children;
    const item = items[params.index];

    const prevDot = item.querySelector('.hot-dot');
    if (!prevDot) {
      const prevDot = document.createElement('div');
      prevDot.setAttribute('class', 'hot-dot');
      item.appendChild(prevDot);
    }
  }

  hideTabBarRedDot(params) {
    if (!this.tabBarEl) {
      return;
    }

    const items = this.tabBarEl.children;
    const item = items[params.index];

    const prevDot = item.querySelector('.hot-dot');
    if (prevDot) {
      prevDot.remove();
    }
  }
}
