/* global my */

let router;

export function useRouter(routerConfig) {
  router = { config: routerConfig, history: routerConfig.history };
  return { Router: null, history: routerConfig.history }; // just noop
}

/**
 * With router decorator.
 * @param Klass
 */
export function withRouter(Klass) {
  if (Klass) Klass.defaultProps = Klass.defaultProps || {};
  Klass.defaultProps.router = router;

  return Klass;
}

/**
 * Navigate to given path.
 */
export function push(path) {
  return my.navigateTo({ url: path });
}

/**
 * Navigate replace.
 */
export function replace(path) {
  return my.redirectTo({ url: path });
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
  return my.navigateBack({ delta: n });
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
