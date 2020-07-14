import { render, createElement, useState, useEffect, Fragment } from 'rax';
import { Navigation, TabBar } from 'rax-pwa';
import { isWeex, isWeb, isKraken, isMiniApp, isWeChatMiniProgram, isByteDanceMicroApp } from 'universal-env';
import { useRouter } from 'rax-use-router';
import { createMemoryHistory, createHashHistory, createBrowserHistory } from 'history';
import { createMiniAppHistory } from 'miniapp-history';
import UniversalDriver from 'driver-universal';
import pathRedirect from './pathRedirect';
import { emit as appEmit, addAppLifeCycle } from './app';
import { SHOW, LAUNCH, ERROR, HIDE, TAB_ITEM_CLICK, NOT_FOUND, SHARE, UNHANDLED_REJECTION } from './constants';
import { setHistory } from './history';
import router from './router';
import { emit as pageEmit } from './page';

const INITIAL_DATA_FROM_SSR = '__INITIAL_DATA__';
const SHELL_DATA = 'shellData';

let launched = false;
let driver = UniversalDriver;
const initialDataFromSSR = global[INITIAL_DATA_FROM_SSR];

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

function handleDynamicConfig(config) {
  if (config.dynamicConfig) {
    const { onLaunch, onShow, onError, onHide, onTabItemClick } = config;
    // multi-end valid lifecycle
    // Add app launch callback
    addAppLifeCycle(LAUNCH, onLaunch);
    // Add app show callback
    addAppLifeCycle(SHOW, onShow);
    // Add app error callback
    addAppLifeCycle(ERROR, onError);
    // Add app hide callback
    addAppLifeCycle(HIDE, onHide);
    // Add tab bar item click callback
    addAppLifeCycle(TAB_ITEM_CLICK, onTabItemClick);
    // Add lifecycle callbacks which only valid in Wechat MiniProgram and ByteDance MicroApp
    if (isWeChatMiniProgram || isByteDanceMicroApp) {
      const { onPageNotFound, onShareAppMessage } = config;
      // Add global share callback
      addAppLifeCycle(SHARE, onShareAppMessage);
      // Add page not found callback
      addAppLifeCycle(NOT_FOUND, onPageNotFound);
    }
    // Add lifecycle callbacks which only valid in Alibaba MiniApp
    if (isMiniApp) {
      const { onShareAppMessage, onUnhandledRejection } = config;
      // Add global share callback
      addAppLifeCycle(SHARE, onShareAppMessage);
      // Add unhandledrejection callback
      addAppLifeCycle(UNHANDLED_REJECTION, onUnhandledRejection);
    }
    return {};
  }
  // Compatible with pageProps
  return config;
}

/**
 * @param {object} staticConfig - the config that from app.json
 * @param {object} dynamicConfig - the config that from developer dynamic set
 */
export default function runApp(staticConfig, dynamicConfig = {}) {
  if (launched) throw new Error('Error: runApp can only be called once.');
  if (dynamicConfig && Object.prototype.toString.call(dynamicConfig) !== '[object Object]') {
    throw new Error('Error: the runApp method second param can only be Object.');
  }

  const pageProps = handleDynamicConfig(dynamicConfig);

  launched = true;
  const { hydrate = false, routes, shell } = staticConfig;

  // Set custom driver
  if (typeof staticConfig.driver !== 'undefined') {
    driver = staticConfig.driver;
  }

  let history;
  // Set history
  if (typeof staticConfig.history !== 'undefined') {
    history = staticConfig.history;
  } else if (initialDataFromSSR) {
    // If that contains `initialDataFromSSR`, which means SSR is enabled,
    // we should use browser history to make it works.
    history = createBrowserHistory();
  } else if (isWeb) {
    history = createHashHistory();
  } else if (isMiniApp || isWeChatMiniProgram || isByteDanceMicroApp) {
    window.history = createMiniAppHistory(routes);
    window.location = window.history.location;
    window.__pageProps = pageProps;
    setHistory(window.history);
    return;
  } else {
    // In other situation use memory history.
    history = createMemoryHistory();
  }

  // Set global history
  setHistory(history);

  // Like https://xxx.com?_path=/page1, use `_path` to jump to a specific route.
  pathRedirect(history, routes);

  const pathname = history.location.pathname;
  let _initialComponent;

  return matchInitialComponent(pathname, routes)
    .then((initialComponent) => {
      _initialComponent = initialComponent;

      let appInstance = createElement(App, {
        appConfig: staticConfig,
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
      appEmit(LAUNCH);
      appEmit(SHOW);

      // Set current router
      router.current = {
        path: pathname,
        visibiltyState: true
      };

      // Listen history change
      history.listen((location) => {
        if (location.pathname !== router.current.path) {
          // Flow router info
          router.prev = router.current;
          router.current = {
            path: location.pathname,
            visibiltyState: true
          };
          router.prev.visibiltyState = false;
          pageEmit(HIDE, router.prev.path);
          pageEmit(SHOW, router.current.path);
        }
      });

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
