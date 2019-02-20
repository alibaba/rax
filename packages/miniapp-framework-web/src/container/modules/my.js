// import * as tabBar from './tabbar';
// import navigation from './navigation';

const EXTERNAL_API_NAMESPACE = 'EXTERNAL_API';
const my = {};

const internalAPIs = [
  'navigateTo',
  'navigateBack',
];
internalAPIs.forEach((apiName) => my[apiName] = true);

/**
 * User defined api.
 */
if (typeof global[EXTERNAL_API_NAMESPACE] === 'object') {
  Object.assign(my, global[EXTERNAL_API_NAMESPACE]);
}

export default my;
