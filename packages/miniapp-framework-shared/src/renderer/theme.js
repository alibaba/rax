// 预置几套主题
const defaultThemes = {
  'taobao': {
    '--color-primary': '#ff5500',
    '--color-warn': '#fb9025',
    '--button-primary-background-color-from': '#ff8800',
    '--button-primary-background-color-to': '#ff5500',
    '--button-primary-text-color': '#ffffff',
    '--button-warn-background-color-from': '#fbca2f',
    '--button-warn-background-color-to': '#fb9025',
    '--button-warn-text-color': '#ffffff',
    '--button-default-background-color-from': '#ffffff',
    '--button-default-background-color-to': '#ffffff',
    '--button-default-text-color': '#ff5500',
    '--button-border-radius': '40px',
  },
  'alipay': {
    '--color-primary': '#2E7ADC',
    '--color-warn': 'red',
    '--button-primary-background-color-from': '#2E7ADC',
    '--button-primary-background-color-to': '#2E7ADC',
    '--button-primary-text-color': '#ffffff',
    '--button-warn-background-color-from': 'red',
    '--button-warn-background-color-to': 'red',
    '--button-warn-text-color': '#ffffff',
    '--button-default-background-color-from': '#ffffff',
    '--button-default-background-color-to': '#ffffff',
    '--button-default-text-color': '#2E7ADC',
    '--button-border-radius': '10px',
  }
};

/**
 * Inject atag theme variables.
 *
 * @param {Object} themeConfig
 * @param {Window} rendererWindow
 */
export function setupTheme(themeConfig, rendererWindow) {
  let themeName = themeConfig && themeConfig.themeName;
  let themeVars = defaultThemes[themeName];

  if (!themeVars) {
    themeName = 'taobao';
    themeVars = defaultThemes[themeName];
  }

  if (themeConfig && themeConfig.customVars) {
    themeVars = Object.assign({}, themeVars, themeConfig.customVars);
  }

  const rootNode = rendererWindow.document.documentElement;
  const supportCssVars = rendererWindow.CSS && rendererWindow.CSS.supports && rendererWindow.CSS.supports('--a', 0);

  if (supportCssVars) {
    setCssVars(themeVars, rootNode);
  } else {
    // 不支持 CSS 变量，动态替换 style 标签里的 css 变量
    const observer = new rendererWindow.MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        let type = mutation.type;
        if (type !== 'childList') {
          continue;
        }

        const node = mutation.addedNodes[0];

        if (node && node.shadowRoot) {
          const styleNode = node.shadowRoot.querySelector('style');
          let styleContent = styleNode.textContent;
          Object.keys(themeVars).forEach((varName) => {
            const value = themeVars[varName];
            // var(--color-primary-3)
            // var(--color-primary-3, '#fff')
            // (to right, var(--color-primary-3), var(--color-primary-2));
            styleContent = styleContent.replace(new RegExp(`var\\(${varName}[^\\)]*\\)`, 'g'), value);
          });
          styleNode.textContent = styleContent;
        }
      }
    });

    observer.observe(rendererWindow.document.body, {
      childList: true,
      subtree: true
    });
  }
}

function setCssVars(cssVars, rootNode) {
  Object.keys(cssVars || {}).forEach((key) => {
    const value = cssVars[key];
    rootNode.style.setProperty(key, value);
  });
}
