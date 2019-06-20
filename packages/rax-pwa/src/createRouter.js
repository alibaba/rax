
import { createElement, useState } from 'rax';
import Error from './Error';
import { createHashHistory, createBrowserHistory } from 'history';
import { useRouter, updateChildrenProps } from 'rax-use-router';

const interopRequire = (obj) => {
  return obj && obj.__esModule ? obj.default : obj;
};

// Mark if the page is loaded for the first time.
// If it is the first time to load, pageInitialProps is taken from the scripts. If the SPA has switched routes then each sub-component needs to run getInitialProps
let isFirstRendered = true;

export default function createRouter(pagesConfig, withSSR = false) {
  let pageHistory = withSSR ? createBrowserHistory() : createHashHistory();

  pageHistory.listen(() => {
    // After routing switching, it is considered not the first rendering.
    isFirstRendered = false;
  });

  // page alive
  let withPageAlive = false;
  let alivePageCache = {};
  let updateComponentTrigger = () => { };

  // base config
  let routerProps = {};
  const childrenPropsRouter = {
    history: pageHistory,
    location: pageHistory.location
  };
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
      route.component = () => <div />;

      alivePageCache[page] = {
        path: pagesConfig[page].path,
        regexp: pagesConfig[page].regexp,
        title: pagesConfig[page].title || null,
        component: null,
        getComponent: pagesConfig[page].component
      };
    } else {
      route.component = pagesConfig[page].component().then(interopRequire)
        .then(async(Page) => {
          if (pagesConfig[page].title) {
            document.title = pagesConfig[page].title;
          }
          let pageInitialProps = {};
          if (Page.getInitialProps) {
            try {
              pageInitialProps = await Page.getInitialProps();
            } catch (e) {
              console.log(`${page} pageInitialProps error: ` + e);
              pageInitialProps = {};
            }
          }
          return <Page {...routerProps} {...pageInitialProps} />;
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
      .then(async(Page) => {
        let pageInitialProps = {};
        if (Page.getInitialProps) {
          try {
            pageInitialProps = await Page.getInitialProps();
          } catch (e) {
            console.log(`${pageName} pageInitialProps error: ` + e);
            pageInitialProps = {};
          }
        }
        alivePageCache[pageName].component = <Page {...routerProps} {...pageInitialProps} />;
        updateComponentTrigger(pageHistory.location.pathname + pageName);
      });
  };


  childrenPropsRouter.preload = (config) => {
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

  childrenPropsRouter.prerender = (config) => {
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
    const { component } = useRouter(routerConfig);
    const [updateTemp, setUpdateTemp] = useState(null);
    if (!isFirstRendered) {
      routerProps = { ...props, router: childrenPropsRouter };
    } else {
      routerProps = { router: childrenPropsRouter };
    }
    updateComponentTrigger = setUpdateTemp;
    if (!withPageAlive) {
      return component;
    } else {
      let cachePageMatched = false;
      return (
        <div style={{ position: 'relative' }}>
          {Object.keys(alivePageCache).map((pageName) => {
            const { pathname, hash } = window.location;
            const isMatched = function(regexp, type) {
              return 'hash' === type ? regexp.test(hash.replace('#', '')) : 'history' === type && regexp.test(pathname);
            };
            cachePageMatched = isMatched(alivePageCache[pageName].regexp, withSSR ? 'history' : 'hash');
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
