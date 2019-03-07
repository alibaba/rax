/* global frameworkType */
import kebabCase from 'kebab-case';
import baseCSS from '!!raw-loader!./assets/container.css';
import Router from '../Router';
import Tabbar from './Tabbar';
import Navigation from './Navigation';

const styles = {
  main: {
    position: 'absolute',
    left: 0,
    right: 0,
    margin: 0,
  },
  iframe: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    borderWidth: 0,
  },
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '10vw',
    backgroundColor: '#f9f9f9',
  },
  headerInfo: {
    fontSize: '16px',
    color: '#272727',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '10vw',
  },
  icon: {
    width: '16px',
  },
  tabBar: {
    width: '100%',
    height: '12.8vw',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    bottom: 0,
    borderTop: '1px solid #eee',
  },
};

const baseStyleTpl = `<style>${baseCSS}</style>`;
const headerBarTpl = `
  <div id="headerBar" style="${serializeStyle(styles.headerBar)}">
    <div class="headerInfo" style="${serializeStyle(styles.headerInfo)}">
      <div id="prev" style="width: 26vw;">
        <img src="https://gw.alicdn.com/tfs/TB1cNCCqTtYBeNjy1XdXXXXyVXa-38-66.png" style="width: 2.5vw; margin-top: 2.6vw; margin-left: 4vw;" />
      </div>
      <div id="title"></div>
      <div style="width: 26vw;">
        <div style="border: 1px solid #ccc; border-radius: 16vw;position: absolute;right: 3vw; padding: 0 2vw; line-height: 10vw; height: 6vw; margin-top: 1.7vw; display: flex;">
          <svg style="cursor: pointer; width: 5vw; margin-right: 2vw;" viewBox="0 0 1024 1024"><path d="M768 448c-35.36 0-64 28.64-64 64s28.64 64 64 64 64-28.64 64-64-28.64-64-64-64m-256 0c-35.36 0-64 28.64-64 64s28.64 64 64 64 64-28.64 64-64-28.64-64-64-64m-256 0c-35.36 0-64 28.64-64 64s28.64 64 64 64 64-28.64 64-64-28.64-64-64-64" fill="#888888"/></svg>
  
          <svg onclick="location.hash='';location.reload()" style="cursor: pointer; width: 5vw;" viewBox="0 0 1024 1024"><path d="M764.8 312.256l-53.12-53.12L512 458.88 312.256 259.136l-53.12 53.12L458.88 512 259.136 711.68l53.12 53.12L512 565.12 711.68 764.8l53.12-53.12L565.12 512 764.8 312.256zm0 0" fill="#888888"/></svg>
        </div>
      </div>
    </div>
  </div>
`;
const mainTpl = `<div id="main" data-main style="${serializeStyle(styles.main)}"></div>`;
const tabBarTpl = `<div id="tabBar" style="${serializeStyle(styles.tabBar)}"></div>`;

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

export default function renderContainerShell(messageRouter, appConfig, mountNode) {
  const {
    defaultTitle,
    navigationBarBackgroundColor,
    navigationBarTextStyle,
    navigationBarTitleText,
  } = appConfig.window;
  const headerBarStyle = {
    backgroundColor: navigationBarBackgroundColor || '#fff',
    color: navigationBarTextStyle || '#000',
  };

  let showHeaderBar = frameworkType === 'ide';
  let showTabBar = false;
  if (appConfig.tabBar && Array.isArray(appConfig.tabBar.list)) {
    showTabBar = true;
  }

  mountNode.innerHTML = `
    ${baseStyleTpl}
    <style> 
      #main {
        top: ${showHeaderBar ? '10vw' : '0'};
        bottom: ${showTabBar ? '12.93vw' : '0'};
      }
    </style>
    ${showHeaderBar ? headerBarTpl : ''}
    ${mainTpl}
    ${showTabBar ? tabBarTpl : ''}
  `;

  // Correct the page font-size
  document.documentElement.style.fontSize = document.documentElement.clientWidth / 750 * 100 + 'px';

  messageRouter.eventHandler({
    data: {
      target: 'AppWorker',
      payload: {
        type: 'app:lifecycle',
        lifecycle: 'show'
      }
    }
  });

  // main, homepage
  const mainEl = document.querySelector('#main');
  const homepage = findHomePage(appConfig);
  const router = new Router(mainEl, messageRouter);

  const tabbarList = showTabBar ? appConfig.tabBar.list : [];
  const tabbarEl = document.querySelector('#tabBar');
  const tabbar = new Tabbar(tabbarList, router, tabbarEl, mainEl);

  const navigation = new Navigation(router, tabbar);

  if (showTabBar && tabbar.check(homepage)) {
    tabbar.switchTab({
      url: homepage
    });
  } else {
    navigation.navigateTo({
      url: homepage
    });
  }

  return { navigation, tabbar };
}

function findHomePage(APP_MANIFEST) {
  const hashRoute = location.hash.replace(/^#?!\//, '');
  if (hashRoute !== '') {
    return hashRoute;
  }
  if ('homepage' in APP_MANIFEST) {
    return APP_MANIFEST.homepage;
  }
  return Object.keys(APP_MANIFEST.pages)[0];
}
