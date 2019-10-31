import { createElement, useEffect, useState, Fragment } from 'rax';
import View from 'rax-view';
import TabBar from '../TabBar/index';

import styles from './index.css';

let _maxAlivePageNum = 3;
let _pageProps = {};
let _routes = [];
let _updatePageTrigger = () => { };

const alivePages = [];
const alivePagesCache = {};

export function activatePageComponent(route) {
  route.component()
    .then(fn => fn())
    .then((Page) => {
      if (!route.keepAlive) {
        // ignore page without keepAlive
        return false;
      }
      alivePagesCache[route.path] = <Page {..._pageProps} />;
      // Prevent cache from being too large
      if (Object.keys(alivePagesCache).length > _maxAlivePageNum) {
        delete alivePagesCache[Object.keys(alivePagesCache)[0]];
      }
      _updatePageTrigger(Date.now());
    });
};

export function getRoutes() {
  return _routes;
}

export default function Navigation(props) {
  const { history, routes, _appConfig, _component } = props;
  const { maxAlivePageNum, tabBar } = _appConfig;

  const [updateTemp, setUpdateTemp] = useState(null);

  const Component = _component;
  const currentPathname = history.location.pathname;
  const currentPage = routes.find(route => route.path === currentPathname);

  const isAlivePage = currentPage.keepAlive;
  useEffect(() => {
    history.listen(() => {
      _updatePageTrigger(Date.now());
    });
    // Use display control alive page, need get alive page list.
    routes.forEach((route) => {
      if (route.keepAlive) {
        alivePages.push(route);
      }
    });
    // If current page is alive page, need update routes.
    if (isAlivePage) {
      _updatePageTrigger(Date.now());
    }
  }, []);

  // Props to page component
  const pageProps = {};
  Object.keys(props).forEach((key) => {
    if (key !== '_appConfig' && key !== '_component') {
      pageProps[key] = props[key];
    }
  });

  _pageProps = pageProps;
  _routes = routes;
  _updatePageTrigger = setUpdateTemp;
  maxAlivePageNum && (_maxAlivePageNum = maxAlivePageNum);

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
          if (isCurrentPage && !alivePageComponent) activatePageComponent(alivePageRoute);
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

      <TabBar
        config={tabBar}
        history={history}
      />
    </Fragment>
  );
}
