const EXTERNAL_API_NAMESPACE = 'EXTERNAL_API';
const my = {};

const internalAPIs = [
  'navigateTo',
  'navigateBack',
  'redirectTo',
  'switchTab',
  'showTabBar',
  'hideTabBar',
  'setTabBarBadge',
  'removeTabBarBadge',
  'showTabBarRedDot',
  'hideTabBarRedDot',
];

internalAPIs.forEach((apiName) => my[apiName] = true);

/**
 * User defined api.
 */
if (typeof global[EXTERNAL_API_NAMESPACE] === 'object') {
  Object.assign(my, global[EXTERNAL_API_NAMESPACE]);
}

export default my;
