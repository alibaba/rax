const appConfigMap = {
  window: {
    defaultTitle: {
      ali: 'defaultTitle',
      wechat: 'navigationBarTitleText'
    },
    pullRefresh: {
      ali: 'pullRefresh',
      wechat: 'enablePullDownRefresh'
    },
    titleBarColor: {
      ali: 'titleBarColor',
      wechat: 'navigationBarBackgroundColor'
    }
  },
  tabBar: {
    textColor: {
      ali: 'textColor',
      wechat: 'color'
    },
    items: {
      ali: 'items',
      wechat: 'list'
    }
  },
  items: {
    name: {
      ali: 'name',
      wechat: 'text'
    },
    icon: {
      ali: 'icon',
      wechat: 'iconPath'
    },
    activeIcon: {
      ali: 'activeIcon',
      wechat: 'selectedIconPath'
    },
    path: {
      ali: 'pagePath',
      wechat: 'pagePath'
    }
  }
};

const adaptValueMap = {
  window: {
    pullRefresh: {
      ali: [
        [true, 'YES'],
        [false, 'NO']
      ]
    }
  }
};

function adaptAppConfig(config, property, platform, originalConfig = {}) {
  if (property === 'items') {
    config[property].forEach(item => {
      Object.keys(item).forEach(itemConfig => {
        if (appConfigMap.items[itemConfig] && appConfigMap.items[itemConfig][platform] !== itemConfig) {
          item[appConfigMap.items[itemConfig][platform]] = itemConfig === 'path' ? getSourceFromPath(item[itemConfig], originalConfig.routes) : item[itemConfig];
          delete item[itemConfig];
        }
      });
    });
  } else if (property === 'window') {
    Object.keys(config).forEach(c => {
      if (appConfigMap[property][c]) {
        if (adaptValueMap[property][c] && adaptValueMap[property][c][platform]) {
          config[c] = getAdaptValue(config[c], adaptValueMap[property][c][platform]);
        }
        if (appConfigMap[property][c][platform] !== c) {
          config[appConfigMap[property][c][platform]] = config[c];
          delete config[c];
        }
      }
    });
  }
}

function getAdaptValue(value, valueMapArr) {
  for (let valuePair of valueMapArr) {
    if (value === valuePair[0]) {
      return valuePair[1];
    }
  }
  return value;
}

/**
 * Get corresponding source from path
 *
 * @param {string} path
 * @param {Array<Object>} routes
 */
function getSourceFromPath(path, routes) {
  for (let route of routes) {
    if (route.path === path) {
      return route.source;
    }
  }
  return null;
}

module.exports = adaptAppConfig;
