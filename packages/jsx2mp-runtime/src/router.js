/* eslint-disable import/no-extraneous-dependencies */
/* global my, wx */
import { getMiniAppHistory } from './history';
import { isMiniApp, isWeChatMiniProgram, isQuickapp } from 'universal-env';

let apiCore;

if (isMiniApp) {
  apiCore = my;
} else if (isWeChatMiniProgram) {
  apiCore = wx;
} else if (isQuickapp) {
  apiCore = require('@system.router');
}

function redirectTo(options) {
  if (isQuickapp) {
    options.uri = options.url;
    apiCore.replace(options);
  } else {
    apiCore.redirectTo(options);
  }
}

function navigateTo(options) {
  if (isQuickapp) {
    options.uri = options.url;
    apiCore.push(options);
  } else {
    apiCore.navigateTo(options);
  }
}

function navigateBack(options) {
  if (isQuickapp) {
    apiCore.back();
  } else {
    apiCore.navigateBack(options);
  }
}

let __routerMap = {};

export function __updateRouterMap(appConfig) {
  appConfig.routes.map(route => {
    __routerMap[route.path] = route.source.replace(/\/index$/, '');
  });
  return __routerMap;
}

/**
 * With router decorator.
 * Inject history and location.
 * @param Klass
 */
export function withRouter(Klass) {
  if (Klass) Klass.props = Klass.props || {};
  const history = getMiniAppHistory();
  Object.assign(Klass.props, {
    history: history,
    location: history.location,
  });

  return Klass;
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

export function setRoutes(routes) {
  __routerMap = routes;
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
