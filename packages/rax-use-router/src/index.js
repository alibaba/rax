// Inspired by react-router and universal-router
import { useState, useLayoutEffect } from 'rax';
import pathToRegexp from 'path-to-regexp';

const cache = {};
function decodeParam(val) {
  try {
    return decodeURIComponent(val);
  } catch (err) {
    return val;
  }
}

function matchPath(route, pathname, parentParams) {
  let { path, routes, exact: end = true, strict = false, sensitive = false } = route;
  // If not has path or has routes that should do not exact match
  if (path == null || routes) {
    end = false;
  }

  // Default path is empty
  path = path || '';

  const regexpCacheKey = `${path}|${end}|${strict}|${sensitive}`;
  const keysCacheKey = regexpCacheKey + '|';

  let regexp = cache[regexpCacheKey];
  let keys = cache[keysCacheKey] || [];

  if (!regexp) {
    regexp = pathToRegexp(path, keys, {
      end,
      strict,
      sensitive
    });
    cache[regexpCacheKey] = regexp;
    cache[keysCacheKey] = keys;
  }

  const result = regexp.exec(pathname);
  if (!result) {
    return null;
  }

  const url = result[0];
  const params = { ...parentParams };

  for (let i = 1; i < result.length; i++) {
    const key = keys[i - 1];
    const prop = key.name;
    const value = result[i];
    if (value !== undefined || !Object.prototype.hasOwnProperty.call(params, prop)) {
      if (key.repeat) {
        params[prop] = value ? value.split(key.delimiter).map(decodeParam) : [];
      } else {
        params[prop] = value ? decodeParam(value) : value;
      }
    }
  }

  return {
    path: !end && url.charAt(url.length - 1) === '/' ? url.substr(1) : url,
    params,
  };
}

function matchRoute(route, baseUrl, pathname, parentParams) {
  let matched;
  let childMatches;
  let childIndex = 0;

  return {
    next() {
      if (!matched) {
        matched = matchPath(route, pathname, parentParams);

        if (matched) {
          return {
            done: false,
            $: {
              route,
              baseUrl,
              path: matched.path,
              params: matched.params,
            },
          };
        }
      }

      if (matched && route.routes) {
        while (childIndex < route.routes.length) {
          if (!childMatches) {
            const childRoute = route.routes[childIndex];
            childRoute.parent = route;

            childMatches = matchRoute(
              childRoute,
              baseUrl + matched.path,
              pathname.substr(matched.path.length),
              matched.params,
            );
          }

          const childMatch = childMatches.next();
          if (!childMatch.done) {
            return {
              done: false,
              $: childMatch.$,
            };
          }

          childMatches = null;
          childIndex++;
        }
      }

      return { done: true };
    },
  };
}


const router = {
  history: null,
  handles: [],
  errorHandler() { },
  addHandle(handle) {
    return router.handles.push(handle);
  },
  removeHandle(handleId) {
    router.handles[handleId - 1] = null;
  },
  triggerHandles(component) {
    router.handles.map((handle) => {
      handle && handle(component);
    });
  },
  match(fullpath) {
    if (fullpath == null) return;

    router.fullpath = fullpath;

    const parent = router.root;
    const matched = matchRoute(
      parent,
      parent.path,
      fullpath
    );

    function next(parent) {
      const current = matched.next();

      if (current.done) {
        const error = new Error(`No match for ${fullpath}`);
        return router.errorHandler(error, router.history.location);
      }

      let component = current.$.route.component;
      if (typeof component === 'function') {
        component = component(current.$.params, router.history.location);
      }

      if (component instanceof Promise) {
        // Lazy loading component by import('./Foo')
        return component.then((component) => {
          // Check current fullpath avoid router has changed before lazy laoding complete
          if (fullpath === router.fullpath) {
            router.triggerHandles(component);
          }
        });
      } else if (component != null) {
        router.triggerHandles(component);
        return component;
      } else {
        return next(parent);
      }
    }

    return next(parent);
  }
};

function matchLocation({ pathname }) {
  router.match(pathname);
}


function getInitialComponent(routerConfig) {
  let InitialComponent = [];

  if (typeof routerConfig === 'function') {
    routerConfig = routerConfig();
  }

  if (routerConfig.InitialComponent) {
    InitialComponent = routerConfig.InitialComponent;
  }

  return InitialComponent;
}

export function useRouter(routerConfig) {
  const [component, setComponent] = useState(getInitialComponent(routerConfig));

  useLayoutEffect(() => {
    if (typeof routerConfig === 'function') {
      routerConfig = routerConfig();
    }

    const history = routerConfig.history;
    const routes = routerConfig.routes;

    router.history = history;
    router.root = Array.isArray(routes) ? { routes } : routes;

    const handleId = router.addHandle((component) => {
      setComponent(component);
    });

    // Init path match
    if (!routerConfig.InitialComponent) {
      matchLocation(history.location);
    }

    const unlisten = history.listen((location, action) => {
      matchLocation(location);
    });

    return () => {
      router.removeHandle(handleId);
      unlisten();
    };
  }, []);

  return { component };
}

export function push(fullpath) {
  router.history.push(fullpath);
}

export function replace(fullpath) {
  router.history.replace(fullpath);
}

export function go(n) {
  router.history.go(n);
}
