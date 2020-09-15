import { createElement, render as raxRender, useEffect, Component } from 'rax';
import { withRouter as raxWithRouter } from 'rax-use-router';
import createShareAPI from 'create-app-shared';
import raxAppRenderer from 'rax-app-renderer';
import miniappRenderer from 'miniapp-renderer';
import DriverUniversal from 'driver-universal';
import { isWeChatMiniProgram, isMiniApp, isByteDanceMicroApp, isWeb, isKraken } from 'universal-env';
import App from './App';

const initialDataFromSSR = global.__INITIAL_DATA__;

let app;
function mount(appInstance, rootEl) {
  return app = raxRender(appInstance, rootEl, {
    driver: DriverUniversal
  });
}

function unmount() {
  return app._internal.unmountComponent.bind(app._internal);
}

const {
  getHistory,
  createHistory,
  withRouter,
  withPageLifeCycle,
  usePageHide,
  usePageShow,
  collectAppLifeCycle,
  addAppLifeCycle,
  emitLifeCycles,
  registerNativeEventListeners,
  addNativeEventListener,
  removeNativeEventListener,
  pathRedirect
} = createShareAPI({
  withRouter: raxWithRouter,
  createElement,
  useEffect
});

function useAppShow(callback) {
  addAppLifeCycle('show', callback);
}

function useAppLaunch(callback) {
  addAppLifeCycle('launch', callback);
}

function useAppShare(callback) {
  addAppLifeCycle('share', callback);
}

function useAppError(callback) {
  addAppLifeCycle('error', callback);
}

function useAppHide(callback) {
  addAppLifeCycle('hide', callback);
}

function usePageNotFound(callback) {
  addAppLifeCycle('notfound', callback);
}

function runApp(staticConfig, dynamicConfig = {}) {
  let renderer = raxAppRenderer;
  let createAppInstance;
  let pageProps;
  const appConfig = {
    app: {
      rootId: 'root'
    },
    router: {}
  };

  if (dynamicConfig.dynamicConfig) {
    Object.assign(appConfig, {
      app: dynamicConfig
    });
  } else {
    pageProps = dynamicConfig;
  }

  const { shell, routes } = staticConfig;
  if (isWeChatMiniProgram || isMiniApp || isByteDanceMicroApp) {
    renderer = miniappRenderer;
  } else {
    createAppInstance = (initialComponent) => {
      const history = getHistory();
      let appInstance = createElement(App, {
        appConfig: staticConfig,
        history,
        routes,
        pageProps,
        InitialComponent: initialComponent
      });

      if (shell) {
        const shellData = initialDataFromSSR ? initialDataFromSSR.shellData : null;
        appInstance = createElement(shell.component, { data: shellData }, appInstance);
      }

      return appInstance;
    };
  }


  renderer({
    createBaseApp: () => {
      let type;
      if (initialDataFromSSR) {
        type = 'browser';
      } else if (isWeb && !isKraken) {
        type = 'hash';
      }
      const history = createHistory({ routes, customHistory: staticConfig.history, type });
      appConfig.router.history = history;
      appConfig.router.type = type;
      collectAppLifeCycle(appConfig);
      return {
        appConfig,
      };
    },
    createHistory,
    staticConfig,
    appConfig,
    pageProps,
    getHistory,
    pathRedirect,
    createAppInstance,
    emitLifeCycles
  }, {
    createElement,
    Component,
    mount,
    unmount
  });
}

export {
  withRouter,
  withPageLifeCycle,
  usePageHide,
  usePageShow,
  registerNativeEventListeners,
  addNativeEventListener,
  removeNativeEventListener,
  runApp,
  useAppLaunch,
  useAppShare,
  useAppError,
  useAppShow,
  useAppHide,
  usePageNotFound
};
