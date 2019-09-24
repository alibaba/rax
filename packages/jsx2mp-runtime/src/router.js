import { navigateTo, redirectTo, navigateBack } from '@@ADAPTER@@';

let router;
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
  if (Klass) Klass.defaultProps = Klass.defaultProps || {};
  Object.assign(Klass.defaultProps, {
    router,
    history: router.history,
    location: router.history.location,
  });

  return Klass;
}

/**
 * Navigate to given path.
 */
export function push(path) {
  return navigateTo({ url: `/${__routerMap[path]}` });
}

/**
 * Navigate replace.
 */
export function replace(path) {
  return redirectTo({ url: `/${__routerMap[path]}` });
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
