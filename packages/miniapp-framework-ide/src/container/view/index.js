import kebabCase from 'kebab-case';
import baseCSS from 'raw-loader!./container.css';
import { getIframeSrcDoc } from '../../renderer/render';
import initRenderer from '../../renderer';
import { createClientId } from '../clientId';
import { createMessageProxy } from '../MessageProxy';

const iframeContent = getIframeSrcDoc({
  viewport: screen.width / 750
});

const styles = {
  main: {
    display: 'flex',
    position: 'absolute',
    top: '10vw',
    bottom: '12.93vw',
    left: 0,
    right: 0,
    margin: 0,
    background: '#f4f4f4',
  },
  iframe: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    borderWidth: 0,
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
    left: '0',
    bottom: '0',
    borderTop: '1px solid #eee',
  },
  tabBarItem: {
    textAlign: 'center',
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
const tpl = `
  <style>${baseCSS}</style>
  <div id="headerBar">
    <div class="headerInfo">
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
  <div id="main" data-main style="${serializeStyle(styles.main)}"></div>
  <div id="tabBar" style="${serializeStyle(styles.tabBar)}"></div>
`;


function createTabBarItem(pageName, imageUrl, textContent, onClick) {
  const tabBarItem = document.createElement('div');
  tabBarItem.style = serializeStyle(styles.tabBarItem);
  tabBarItem.dataset.pageName = pageName;

  const img = document.createElement('img');
  img.ariaHidden = true;
  img.style = serializeStyle(styles.icon);
  img.src = imageUrl;

  const text = document.createElement('div');
  text.innerText = textContent;
  text.style = serializeStyle(styles.tabBarItemText);
  tabBarItem.appendChild(img);
  tabBarItem.appendChild(text);

  tabBarItem.addEventListener('click', onClick);
  return tabBarItem;
}

function createIframe(onLoad) {
  const iframe = document.createElement('iframe');
  iframe.style = serializeStyle(styles.iframe);
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-modals allow-popups allow-forms');
  iframe.setAttribute('scrolling', 'yes');
  iframe.setAttribute('data-iframe', 'true');
  iframe.setAttribute('srcDoc', iframeContent);
  iframe.addEventListener('load', onLoad);

  return iframe;
}

/**
 * Serialize Style Object
 * @param obj {Object}
 * @return {String}
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

  mountNode.innerHTML = tpl;
  const headerBarEl = mountNode.querySelector('#headerBar');
  const mainEl = mountNode.querySelector('#main');
  const tabBarEl = mountNode.querySelector('#tabBar');

  // Set default title
  const title = mountNode.querySelector('#title');
  title.textContent = navigationBarTitleText || defaultTitle;

  if (appConfig.tabBar && Array.isArray(appConfig.tabBar.list)) {
    /**
     * pageName, pageName, iconPath, selectedIconPath
     */
    appConfig.tabBar.list.forEach((item) => {
      tabBarEl.appendChild(
        createTabBarItem(item.pageName, item.iconPath, item.text, onTabBarItemClick)
      );
    });
  }

  const iframe = createIframe(() => {
    const { contentWindow } = iframe;
    const { pageName } = appConfig.pages[0];
    const clientId = createClientId();
    const messageProxy = createMessageProxy(messageRouter, clientId, pageName);
    messageRouter.addChannel(clientId, messageProxy);
    initRenderer(contentWindow, clientId, {}, appConfig.themeConfig);
  });
  mainEl.appendChild(iframe);
}

function onTabBarItemClick(evt) {
  const { pageName } = evt.currentTarget.dataset;
  if (!pageName) return;
  console.log('change to tab', pageName);
}

