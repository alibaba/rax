import { navigateTo, redirectTo, navigateBack} from '@@ADAPTER@@';

let router;

export function useRouter(routerConfig) {
  const history = routerConfig && routerConfig.history;
  router = { config: routerConfig, history };
  return { Router: null, history }; // just noop
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
  return navigateTo({ url: `/${router.config[path]}` });
}

/**
 * Navigate replace.
 */
export function replace(path) {
  return redirectTo({ url: `/${router.config[path]}` });
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
