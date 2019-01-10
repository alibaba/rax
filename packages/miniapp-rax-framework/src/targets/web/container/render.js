import MiniAppRouter from './Router';
import { findHomePage } from './utils';
import { setupTheme } from '../../../core/renderer/atagTheme';

/**
 * DOM Operation in container.
 */
export default function render(appManifest) {
  const router = new MiniAppRouter();

  const tabbarContainer = document.querySelector('#tabBar');
  const mainContainer = document.querySelector('#main');
  const tabbarItemTemplate = document.querySelector(
    '#tabBarItemTemplate'
  ).innerHTML;
  const tabbarList =
    appManifest.tabBar && Array.isArray(appManifest.tabBar.list)
      ? appManifest.tabBar.list
      : [];
  let selectedTab;

  if (appManifest.window) {
    const headerBar = document.querySelector('#headerBar');
    const headerInfo = headerBar.querySelector('.headerInfo');
    const title = headerInfo.querySelector('.title');
    headerBar.style.backgroundColor =
      appManifest.window.navigationBarBackgroundColor ||
      'rgb(255, 255, 255)';
    headerInfo.style.color =
      appManifest.window.navigationBarTextStyle || 'rgb(0, 0, 0)';
    title.innerText =
      appManifest.window.navigationBarTitleText || '';
  }

  let fragment = '';
  if (appManifest.tabBar && Array.isArray(tabbarList)) {
    tabbarList.forEach(function(tabbarItem) {
      fragment += tabbarItemTemplate
        .replace(/\$1/, tabbarItem.iconPath)
        .replace(/\$2/, tabbarItem.text)
        .replace(/\$3/g, tabbarItem.pageName)
        .replace(/\$4/, false);
    });
  }

  if (fragment) {
    tabbarContainer.innerHTML = fragment;
    tabbarContainer.style.display = 'flex';
    mainContainer.style.bottom = '12.8vw';
    [].slice
      .call(tabbarContainer.querySelectorAll('.tabbarItem'))
      .forEach(function(tabbarItem, idx, self) {
        tabbarItem.addEventListener('click', function(evt) {
          const { pageName } = evt.currentTarget.dataset;
          if (pageName !== selectedTab) {
            // 找到现在被选中的 item 然后取消选中状态
            let prevIndex;
            const selectedItem = self.find((item, index) => {
              if (item.dataset.pageName === selectedTab) {
                prevIndex = index;
                return true;
              }
              return false;
            });

            if (selectedItem) {
              const prevIcon = selectedItem.querySelector('.icon');
              prevIcon.setAttribute(
                'src',
                tabbarList[prevIndex].iconPath
              );
            }

            if (tabbarList[idx].selectedIconPath) {
              const icon = tabbarItem.querySelector('.icon');
              icon.setAttribute(
                'src',
                tabbarList[idx].selectedIconPath
              );
            }
            selectedTab = pageName;
          }
          router.switchTab({
            pageName,
          });
        });
      });
  } else {
    tabbarContainer.style.display = 'none';
    mainContainer.style.bottom = '0px';
  }

  document
    .querySelector('#prev')
    .addEventListener('click', router.navigateBack);

  // 根据项目配置初始化 css 变量
  const themeConfig = window.APP_MANIFEST ? window.APP_MANIFEST.themeConfig : {};
  setupTheme(themeConfig, window);

  // Correct the page font-size
  document.documentElement.style.fontSize = document.documentElement.clientWidth / 750 * 100 + 'px';

  // main, homepage
  const homepage = findHomePage(appManifest);

  // init homepage's tabbar
  initHomePage();
  router.navigateTo({
    pageName: homepage,
  });

  function initHomePage() {
    selectedTab = homepage;
    let selectedIndex;
    const selectedItem = [].slice
      .call(tabbarContainer.querySelectorAll('.tabbarItem'))
      .find((item, index) => {
        if (item.dataset.pageName === selectedTab) {
          selectedIndex = index;
          return true;
        }
        return false;
      });
    if (
      undefined !== selectedIndex &&
      tabbarList[selectedIndex].selectedIconPath
    ) {
      const icon = selectedItem.querySelector('.icon');
      icon.setAttribute(
        'src',
        tabbarList[selectedIndex].selectedIconPath
      );
    }
  }
}
