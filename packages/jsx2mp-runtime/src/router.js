/* eslint-disable import/no-extraneous-dependencies */
/* global my, wx, tt */
import { isMiniApp, isWeChatMiniProgram, isQuickApp, isByteDanceMicroApp } from 'universal-env';

let apiCore;

if (isMiniApp) {
  apiCore = my;
} else if (isWeChatMiniProgram) {
  apiCore = wx;
} else if (isByteDanceMicroApp) {
  apiCore = tt;
} else if (isQuickApp) {
  apiCore = require('@system.router');
}

function redirectTo(options) {
  if (isQuickApp) {
    options.uri = options.url;
    apiCore.replace(options);
  } else {
    apiCore.redirectTo(options);
  }
}

function navigateTo(options) {
  if (isQuickApp) {
    options.uri = options.url;
    apiCore.push(options);
  } else {
    apiCore.navigateTo(options);
  }
}

function navigateBack(options) {
  if (isQuickApp) {
    apiCore.back();
  } else {
    apiCore.navigateBack(options);
  }
}

let __routerMap = {};

export function __updateRouterMap(appConfig) {
  appConfig.routes.map(route => {
    // Rule of source in appConfig differs from Quickapp's manifest
    if (isQuickApp) {
      __routerMap[route.path] = route.source.replace(/\/index$/, '');
    } else {
      __routerMap[route.path] = route.source;
    }
  });
  // return as globalRoutes for Quickapp
  if (isQuickApp) {
    return __routerMap;
  }
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

export function setRoutes(routes) {
  __routerMap = routes;
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
  if (query) {
    if (search) {
      search += `&${stringifyQuery(query)}`;
    } else {
      search = stringifyQuery(query);
    }
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
