import kebabCase from 'kebab-case';
import { log } from 'miniapp-framework-shared';

const styles = {
  tabBarItem: {
    textAlign: 'center',
    position: 'relative'
  },
  tabBarItemText: {
    fontSize: '12px',
    color: '#686868',
    whiteSpace: 'nowrap',
    lineHeight: '1em',
  },
  icon: {
    width: '16px',
  },
};

/**
 * Serialize Style Object
 * @param obj {Object}
 * @return css {CSSStyleDeclaration}
 */
function serializeStyle(obj) {
  let css = '';
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      css += `${kebabCase(key)}:${obj[key]};`;
    }
  }
  return css;
}

function createTabBarItem(pageName, imageUrl, textContent, onClick) {
  const tabBarItem = document.createElement('div');
  tabBarItem.style = serializeStyle(styles.tabBarItem);
  tabBarItem.dataset.pageName = pageName;

  const img = document.createElement('img');
  img.ariaHidden = true;
  img.style = serializeStyle(styles.icon);
  img.setAttribute('class', 'icon');
  img.src = imageUrl;

  const text = document.createElement('div');
  text.innerText = textContent;
  text.style = serializeStyle(styles.tabBarItemText);
  tabBarItem.appendChild(img);
  tabBarItem.appendChild(text);

  tabBarItem.addEventListener('click', onClick);
  return tabBarItem;
}

export default class Tabbar {
  constructor(data, router, tabBarEl, mainEl) {
    this.data = data;
    this.router = router;
    this.tabBarEl = tabBarEl;
    this.mainEl = mainEl;
    this.selectedTab = null;

    if (data && data.length) {
      /**
       * Init Tabbar
       * { pageName, pageName, iconPath, selectedIconPath }
       */
      data.forEach(({ pageName, iconPath, text }) => {
        tabBarEl.appendChild(createTabBarItem(pageName, iconPath, text, this._onTabBarItemClick));
      });
    }

    router.listen((client) => {
      if (client.isTab) {
        this.showTabBar();
      } else {
        this.hideTabBar();
      }
    });
  }

  _onTabBarItemClick = (evt) => {
    const { pageName } = evt.currentTarget.dataset;
    this.switchTab({
      url: pageName
    });
  }

  check(pageName) {
    const item = this.data.find((item) => {
      if (item.pageName === pageName) {
        return true;
      }
    });

    return item ? true : false;
  }

  switchTab(params) {
    const { url: pageName } = params;

    if (!pageName) {
      log('Can not redirect to empty page.');
      return;
    }

    if (!this.check(pageName)) {
      log('Can not redirect to a page without tabbar.');
      return;
    }

    if (this.router.currentClient) {
      if (this.router.currentClient.pageName === pageName) {
        log('Can not redirect to same page.');
        return;
      } else if (!this.check(this.router.currentClient.pageName)) {
        log('Can not call switchTab in a page without tabbar.');
        return;
      }
    }

    const data = this.data;
    const selectedTab = this.selectedTab;

    if (pageName !== selectedTab) {
      // 找到现在被选中的 item 然后取消选中状态
      let prevIndex;
      let nextIndex;

      data.map((item, index) => {
        if (item.pageName === selectedTab) {
          prevIndex = index;
        }
        if (item.pageName === pageName) {
          nextIndex = index;
        }
      });

      const items = this.tabBarEl.children;
      if (prevIndex) {
        const selectedItem = items[prevIndex];
        const prevIcon = selectedItem.querySelector('.icon');
        prevIcon.setAttribute(
          'src',
          data[prevIndex].iconPath
        );
      }

      if (nextIndex < 0) {
        log('Can not redirect to empty page.');
        return;
      }

      if (data[nextIndex].selectedIconPath) {
        const tabbarItem = items[nextIndex];
        const icon = tabbarItem.querySelector('.icon');
        icon.setAttribute(
          'src',
          data[nextIndex].selectedIconPath
        );
      }

      this.selectedTab = pageName;
    }

    this.router.switchTab({
      pageName
    });
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
