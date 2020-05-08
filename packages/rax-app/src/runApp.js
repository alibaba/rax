import { render, createElement, useState, useEffect, Fragment } from 'rax';
import { Navigation, TabBar } from 'rax-pwa';
import { isWeex, isWeb, isKraken, isMiniApp, isWeChatMiniProgram } from 'universal-env';
import { useRouter } from 'rax-use-router';
import { createMemoryHistory, createHashHistory, createBrowserHistory } from 'history';
import { createMiniAppHistory } from 'miniapp-history';
import UniversalDriver from 'driver-universal';
import pathRedirect from './pathRedirect';
import { emit } from './app';

const INITIAL_DATA_FROM_SSR = '__INITIAL_DATA__';
const SHELL_DATA = 'shellData';

let history;
let launched = false;
let driver = UniversalDriver;
const initialDataFromSSR = global[INITIAL_DATA_FROM_SSR];

export function getHistory() {
  return history;
}

function App(props) {
  const { appConfig, history, routes, pageProps, InitialComponent } = props;
  const { component } = useRouter(() => ({ history, routes, InitialComponent }));

  if (isNullableComponent(component)) {
    // Return null directly if not matched.
    return null;
  } else {
    const [pageInitialProps, setPageInitialProps] = useState(
      // If SSR is enabled, set pageInitialProps: {pagePath: pageData}
      initialDataFromSSR ? { [initialDataFromSSR.pagePath || '']: initialDataFromSSR.pageData || {} } : {}
    );

    // If SSR is enabled, process getInitialProps method
    if (isWeb && initialDataFromSSR && component.getInitialProps && !pageInitialProps[component.__path]) {
      useEffect(() => {
        const getInitialPropsPromise = component.getInitialProps();

        // Check getInitialProps returns promise.
        if (process.env.NODE_ENV !== 'production') {
          if (!getInitialPropsPromise.then) {
            throw new Error('getInitialProps should be async function or return a promise. See detail at "' + component.name + '".');
          }
        }

        getInitialPropsPromise.then((nextDefaultProps) => {
          if (nextDefaultProps) {
            // Process pageData from SSR
            const pageData = initialDataFromSSR && initialDataFromSSR.pagePath === component.__path ? initialDataFromSSR.pageData : {};
            // Do not cache getInitialPropsPromise result
            setPageInitialProps(Object.assign({}, { [component.__path]: Object.assign({}, pageData, nextDefaultProps) }));
          }
        }).catch((error) => {
          // In case of uncaught promise.
          throw error;
        });
      });
      // Early return null if initialProps were not get.
      return null;
    }

    if (isWeb) {
      return createElement(
        Navigation,
        Object.assign(
          { appConfig, component, history, location: history.location, routes, InitialComponent },
          pageInitialProps[component.__path],
          pageProps
        )
      );
    }

    return createElement(
      Fragment,
      {},
      createElement(component, Object.assign({ history, location: history.location, routes, InitialComponent }, pageInitialProps[component.__path], pageProps)),
      createElement(TabBar, { history, config: appConfig.tabBar })
    );
  }
}

function isNullableComponent(component) {
  return !component || Array.isArray(component) && component.length === 0;
}

export default function runApp(appConfig, pageProps = {}) {
  if (launched) throw new Error('Error: runApp can only be called once.');
  if (pageProps && Object.prototype.toString.call(pageProps) !== '[object Object]') {
    throw new Error('Error: pageProps can only be Object.');
  }
  launched = true;
  const { hydrate = false, routes, shell } = appConfig;

  // Set custom driver
  if (typeof appConfig.driver !== 'undefined') {
    driver = appConfig.driver;
  }

  // Set history
  if (typeof appConfig.history !== 'undefined') {
    history = appConfig.history;
  } else if (initialDataFromSSR) {
    // If that contains `initialDataFromSSR`, which means SSR is enabled,
    // we should use browser history to make it works.
    history = createBrowserHistory();
  } else if (isWeb) {
    history = createHashHistory();
  } else {
    // In other situation use memory history.
    history = createMemoryHistory();
  }

  // In MiniApp, it needn't return App Component
  if (isMiniApp || isWeChatMiniProgram) {
    window.history = createMiniAppHistory(routes);
    window.location = window.history.location;
    window.__pageProps = pageProps;
    return;
  }

  // Like https://xxx.com?_path=/page1, use `_path` to jump to a specific route.
  pathRedirect(history, routes);

  let _initialComponent;
  return matchInitialComponent(history.location.pathname, routes)
    .then((initialComponent) => {
      _initialComponent = initialComponent;
      let appInstance = createElement(App, {
        appConfig,
        history,
        routes,
        pageProps,
        InitialComponent: _initialComponent
      });

      if (shell) {
        const shellData = initialDataFromSSR ? initialDataFromSSR[SHELL_DATA] : null;
        appInstance = createElement(shell.component, { data: shellData }, appInstance);
      }

      // Emit app launch cycle.
      emit('launch');

      let rootEl = isWeex || isKraken ? null : document.getElementById('root');
      if (isWeb && rootEl === null) console.warn('Error: Can not find #root element, please check which exists in DOM.');
      // Async render.
      return render(
        appInstance,
        rootEl,
        { driver, hydrate }
      );
    });
}

function matchInitialComponent(fullpath, routes) {
  let initialComponent = null;
  for (let i = 0, l = routes.length; i < l; i++) {
    if (fullpath === routes[i].path || routes[i].regexp && routes[i].regexp.test(fullpath)) {
      initialComponent = routes[i].component;
      if (typeof initialComponent === 'function') initialComponent = initialComponent();
      break;
    }
  }

  return Promise.resolve(initialComponent);
}
