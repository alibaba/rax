/* eslint-disable import/no-extraneous-dependencies */
import { isMiniApp, isWeChatMiniProgram } from 'universal-env';

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

let __routerMap = {};

export function __updateRouterMap(appConfig) {
  appConfig.routes.map(route => {
    __routerMap[route.path] = route.source;
  });
}

/**
 * With router decorator.
 * Inject history and location.
 * @param Component
 */
export function withRouter(Component) {
  Component.__injectHistory = true;
  return Component;
}

/**
 * Navigate to given path.
 */
export function push(path, query) {
  return navigateTo({ url: generateUrl(path, query) });
}

/**
 * Navigate replace.
 */
export function replace(path, query) {
  return redirectTo({ url: generateUrl(path, query) });
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
 * @param {string} path
 * @param {object} query
 */
function generateUrl(path, query) {
  let [pathname, search] = path.split('?');
  const miniappPath = __routerMap[pathname];
  if (!miniappPath) {
    throw new Error(`Path ${path} is not found`);
  }
  if (search) {
    search += `&${stringifyQuery(query)}`;
  } else {
    search = stringifyQuery(query);
  }
  return search ? `/${miniappPath}?${search}` : `/${miniappPath}`;
}

/**
 * Stringify query
 * @param {object} query - route query
 * @return {string}
 */
function stringifyQuery(query) {
  return Object.keys(query).reduce((total, nextKey, index) => {
    return `${total}${index ? '&' : ''}${nextKey}=${query[nextKey]}`;
  }, '');
}
