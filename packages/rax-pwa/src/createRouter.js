
import { createElement, useState } from 'rax';
import Error from './Error';
import isPathMatched from './isPathMatched';
import { createHashHistory, createBrowserHistory } from 'history';
import { useRouter, push, replace, go } from 'rax-use-router';

const interopRequire = function(obj) {
  return obj && obj.__esModule ? obj.default : obj;
};

// Mark if the page is loaded for the first time.
// If it is the first time to load, SSR pageInitialProps is taken from the scripts.
// If the SPA has switched routes then each sub-component needs to run getInitialProps
let isFirstLoadFromSSR = true;
const router = {
  history: null,
  location: null,
  push, replace, go
};

const getComponentWithInitialProps = (name, Component, routerProps) => {
  if (isFirstLoadFromSSR) {
    return <Component {...routerProps} />;
  } else {
    return Component.getInitialProps().then((props) => {
      return <Component {...routerProps} {...props} />;
    }).catch((e) => {
      console.log(`${name} pageInitialProps error: ` + e);
      return <Component {...routerProps} />;
    });
  }
};

function createRouter(pagesConfig, withSSR = false, InitialComponent = null, initialComponentProps = {}) {
  let pageHistory = withSSR ? createBrowserHistory() : createHashHistory();
  if (!withSSR) isFirstLoadFromSSR = false;
  pageHistory.listen(() => {
    // After routing switching, it is considered not the first rendering.
    isFirstLoadFromSSR = false;
  });

  // page alive
  let withPageAlive = false;
  let alivePageCache = {};
  let updateComponentTrigger = function() { };

  // base config
  let routerProps = {};
  router.history = pageHistory;
  router.location = pageHistory.location;

  const routerConfig = {
    history: pageHistory,
    routes: []
  };

  Object.keys(pagesConfig).forEach((page) => {
    const route = {
      path: pagesConfig[page].path,
      component: null
    };

    if (pagesConfig[page].pageAlive) {
      withPageAlive = true;
      // router return empty element
      route.component = () => <div />;
      // add alive page to cache
      alivePageCache[page] = {
        path: pagesConfig[page].path,
        regexp: pagesConfig[page].regexp,
        title: pagesConfig[page].title || null,
        component: null,
        getComponent: pagesConfig[page].component
      };
    } else {
      route.component = () => pagesConfig[page].component().then(interopRequire)
        .then((Page) => {
          if (pagesConfig[page].title) {
            document.title = pagesConfig[page].title;
          }
          if (Page.getInitialProps) {
            return getComponentWithInitialProps(page, Page, routerProps);
          }
          return <Page {...routerProps} />;
        });
    }

    if (page === 'index') {
      routerConfig.routes.push({
        ...route, path: ''
      });
      routerConfig.routes.push(route);
    } else if (page === '_error') {
      delete route.path;
      routerConfig.routes.push(route);
    } else {
      routerConfig.routes.push(route);
    }
  });

  if (!pagesConfig._error) {
    routerConfig.routes.push({
      component: () => <Error />
    });
  }

  const activateAlivePageComponent = (pageName) => {
    if (!alivePageCache[pageName]) return false;

    alivePageCache[pageName].getComponent()
      .then(interopRequire)
      .then((Page) => {
        if (Page.getInitialProps) {
          getComponentWithInitialProps(pageName, Page, routerProps).then((Component) => {
            alivePageCache[pageName].component = Component;
            updateComponentTrigger(pageHistory.location.pathname + pageName);
          });
        } else {
          alivePageCache[pageName].component = <Page {...routerProps} />;
          updateComponentTrigger(pageHistory.location.pathname + pageName);
        }
      });
  };


  router.preload = (config) => {
    if (config.page) {
      pagesConfig[config.page].component();
    } else {
      const linkElement = document.createElement('link');
      linkElement.rel = 'preload';
      linkElement.as = config.as;
      linkElement.href = config.href;
      config.crossorigin && (linkElement.crossorigin = true);
      document.head.appendChild(linkElement);
    }
  };

  router.prerender = (config) => {
    if (config.page) {
      if (withPageAlive) {
        activateAlivePageComponent(config.page);
      } else {
        pagesConfig[config.page].component();
      }
    } else {
      const linkElement = document.createElement('link');
      linkElement.rel = 'prerender';
      linkElement.href = config.href;
      document.head.appendChild(linkElement);
    }
  };

  return function(props) {
    routerProps = { ...props, router };

    if (InitialComponent) {
      routerConfig.InitialComponent = <InitialComponent {...routerProps} {...initialComponentProps} />;
    }

    const { component } = useRouter(routerConfig);
    const [updateTemp, setUpdateTemp] = useState(null);

    updateComponentTrigger = setUpdateTemp;
    if (!withPageAlive) {
      return component;
    } else {
      let cachePageMatched = false;
      return (
        <div style={{ position: 'relative' }}>
          {Object.keys(alivePageCache).map((pageName) => {
            cachePageMatched = isPathMatched(withSSR ? 'history' : 'hash', alivePageCache[pageName].regexp, pageName);
            const element = alivePageCache[pageName].component;
            if (cachePageMatched && element === null) {
              activateAlivePageComponent(pageName);
            }
            if (cachePageMatched && alivePageCache[pageName].title) {
              document.title = alivePageCache[pageName].title;
            }
            return <div style={{ display: cachePageMatched ? 'block' : 'none' }}>{element}</div>;
          })}
          {cachePageMatched ? null : component}
        </div>
      );
    }
  };
}


export { createRouter, router };
