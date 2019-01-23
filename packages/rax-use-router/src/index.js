// Inspired by universal-router
import { useState, useEffect } from 'rax';
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
  const end = !route.children; // When true the regexp will matched to the end of the string
  const routePath = route.path || '';

  const cacheKey = `${routePath}|${end}`;
  let regexp = cache[cacheKey];
  let keys = [];
  if (!regexp) {
    regexp = pathToRegexp(routePath, keys, { end });
    cache[cacheKey] = regexp;
  }

  const result = regexp.exec(pathname);
  if (!result) {
    return null;
  }

  const path = result[0];
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
    path: !end && path.charAt(path.length - 1) === '/' ? path.substr(1) : path,
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

      if (matched && route.children) {
        while (childIndex < route.children.length) {
          if (!childMatches) {
            const childRoute = route.children[childIndex];
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
  changeHandler() { },
  errorHandler() { },
  match(fullpath) {
    if (fullpath == null) return;

    const matched = matchRoute(
      router.root,
      '',
      fullpath
    );

    function next(parent) {
      const current = matched.next();

      if (current.done) {
        const error = new Error('Route not found');
        return router.errorHandler(error, { pathname: fullpath });
      }

      let component;
      const action = current.$.route.action;
      if (typeof action === 'function') {
        component = action(current.$.params, { pathname: fullpath });
      }

      if (component instanceof Promise) {
        // Lazy loading component by import('./Foo')
        component.then((component) => {
          component = component.__esModule ? component.default : component;
          router.changeHandler(component);
        });
        return;
      } else if (component !== null && component !== undefined) {
        router.changeHandler(component);
        return component;
      } else {
        return next(parent);
      }
    }

    return next(router.root);
  }
};

export function useRouter(routes, initPathname) {
  router.root = Array.isArray(routes) ? { path: '', children: routes } : routes;

  const [component, setComponent] = useState([]);

  useEffect(() => {
    router.changeHandler = (component) => {
      setComponent(component);
    };

    router.matched(initPathname);

    return () => {
      router.changeHandler = () => {};
    };
  }, []);

  return component;
}

export function push(fullpath) {
  router.match(fullpath);
}
