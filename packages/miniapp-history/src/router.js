import { isMiniApp, isWeChatMiniProgram } from 'universal-env';

let __routerMap = {};

let apiCore;

if (isMiniApp) {
  apiCore = my;
} else if (isWeChatMiniProgram) {
  apiCore = wx;
}

function redirectTo(options) {
  apiCore.redirectTo(options);
}

function navigateTo(options) {
  apiCore.navigateTo(options);
}

function navigateBack(options) {
  apiCore.navigateBack(options);
}

export function __updateRouterMap(routes) {
  routes.map(route => {
    __routerMap[route.path] = route.source;
  });
}

/**
 * Navigate to given path.
 */
export function push(path) {
  return navigateTo({ url: generateUrl(path) });
}

/**
 * Navigate replace.
 */
export function replace(path) {
  return redirectTo({ url: generateUrl(path) });
}

/**
 * Unsupported in miniapp.
 */
export function go() {
  throw new Error('Unsupported go in miniapp.');
}

/**
 * Navigate back.
 */
export function goBack(n = 1) {
  return navigateBack({ delta: n });
}

/**
 * Unsupported in miniapp.
 */
export function goForward() {
  throw new Error('Unsupported goForward in miniapp.');
}

/**
 * Unsupported in miniapp.
 * @return {boolean} Always true.
 */
export function canGo() {
  return true;
}

/**
 * Generate MiniApp url
 * @param {String} path
 */
function generateUrl(path) {
  const [pathname, query] = path.split('?');
  const miniappPath = __routerMap[pathname];
  if (!miniappPath) {
    throw new Error(`Path ${path} is not found`);
  }
  return query ? `/${miniappPath}?${query}` : `/${miniappPath}`;
}
