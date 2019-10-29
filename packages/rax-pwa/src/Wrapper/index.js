import { createElement, Fragment, useEffect, useState } from 'rax';
import View from 'rax-view';
import TabBar from '../TabBar/index';

import styles from './index.css';

let updatePageTrigger = () => { };

const alivePages = [];
const alivePagesCache = {};

const activatePageComponent = (route, pageProps, maxAlivePageNum) => {
  route.component()
    .then(fn => fn())
    .then((Page) => {
      alivePagesCache[route.path] = <Page {...pageProps} />;
      // Prevent cache from being too large
      if (Object.keys(alivePagesCache).length > maxAlivePageNum) {
        delete alivePagesCache[Object.keys(alivePagesCache)[0]];
      }
      updatePageTrigger(Date.now());
    });
};

export default function Wrapper(props) {
  const { history, routes, _appConfig, _component } = props;
  const { maxAlivePageNum = 3, tabBar } = _appConfig;

  const [updateTemp, setUpdateTemp] = useState(null);
  updatePageTrigger = setUpdateTemp;

  const Component = _component;
  const currentPathname = history.location.pathname;
  const currentPage = routes.find(route => route.path === currentPathname);

  const showTabBar =
    // Have tabBar config
    typeof tabBar === 'object' && Array.isArray(tabBar.items)
    // Current page need show tabBar
    && tabBar.items.find(item => item.pagePath === currentPage.path);
  const isAlivePage = currentPage.keepAlive;
  useEffect(() => {
    history.listen(() => {
      updatePageTrigger(Date.now());
    });
    // Use display control alive page, need get alive page list.
    routes.forEach((route) => {
      if (route.keepAlive) {
        alivePages.push(route);
      }
    });
    // If current page is alive page, need update routes.
    if (isAlivePage) {
      updatePageTrigger(Date.now());
    }
  }, []);

  // Props to page component
  const pageProps = {};
  Object.keys(props).forEach((key) => {
    if (key !== '_appConfig' && key !== '_component') {
      pageProps[key] = props[key];
    }
  });

  // preload({path: 'pages/Home/index'});
  // preload({href: '//xxx.com/font.woff', as: 'font', crossorigin: true});
  pageProps.preload = (config) => {
    if (config.path) {
      const targetRoute = routes.find(route => route.path === config.path);
      targetRoute && targetRoute.component();
    } else {
      const linkElement = document.createElement('link');
      linkElement.rel = 'preload';
      linkElement.as = config.as;
      linkElement.href = config.href;
      config.crossorigin && (linkElement.crossorigin = true);
      document.head.appendChild(linkElement);
    }
  };

  // rerender({path: 'pages/Home/index'});
  // rerender({href:'https://m.taobao.com'});
  pageProps.prerender = config => {
    if (config.path) {
      const targetRoute = routes.find(route => route.path === config.path);
      if (targetRoute) {
        if (targetRoute.keepAlive) {
          activatePageComponent(targetRoute, pageProps, maxAlivePageNum);
        } else {
          targetRoute.component();
        }
      }
    } else {
      const linkElement = document.createElement('link');
      linkElement.rel = 'prerender';
      linkElement.href = config.href;
      document.head.appendChild(linkElement);
    }
  };

  return (
    <Fragment>
      {isAlivePage ? null : <Component {...pageProps} />}

      <View
        style={{
          ...styles.container,
          display: isAlivePage ? 'block' : 'none'
        }}
      >
        {alivePages.map((alivePage, index) => {
          const alivePageRoute = routes.find(route => route.path === alivePage.path);
          const isCurrentPage = alivePageRoute.path === currentPage.path;
          const alivePageComponent = alivePagesCache[alivePageRoute.path] || null;
          if (isCurrentPage && !alivePageComponent) activatePageComponent(alivePageRoute, pageProps, maxAlivePageNum);
          return (
            <View
              key={`alivePage${index}`}
              style={{
                ...styles.alivePage,
                display: isCurrentPage ? 'block' : 'none'
              }}>
              {alivePageComponent}
            </View>
          );
        })}
      </View>

      {showTabBar ? (
        <TabBar
          {...tabBar}
          history={history}
          pathname={currentPathname}
        />
      ) : null}
    </Fragment>
  );
}
