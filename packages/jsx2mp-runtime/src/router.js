import { navigateTo, redirectTo, navigateBack } from '@@ADAPTER@@';
import { getMiniAppHistory } from './history';

let __routerMap = {};

export function __updateRouterMap(appConfig) {
  appConfig.routes.map(route => {
    __routerMap[route.path] = route.source;
  });
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
