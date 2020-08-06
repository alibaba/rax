import { createElement, render as raxRender, useEffect, Component } from 'rax';
import { withRouter as raxWithRouter } from 'rax-use-router';
import createShareAPI from 'create-app-shared';
import raxAppRenderer from 'rax-app-renderer';
import miniappRenderer from 'miniapp-renderer';
import DriverUniversal from 'driver-universal';
import { isWeChatMiniProgram, isMiniApp, isByteDanceMicroApp, isWeb, isKraken } from 'universal-env';
import App from './App';
import { enhanceAppLifeCycle, useAppLaunch, useAppShare, useAppError, useAppShow, useAppHide, usePageNotFound } from './appLifyCycles';

const initialDataFromSSR = global.__INITIAL_DATA__;


function render(appInstance, rootEl) {
  return raxRender(appInstance, rootEl, {
    driver: DriverUniversal
  });
}

const {
  getHistory,
  createHistory,
  withRouter,
  withPageLifeCycle,
  usePageHide,
  usePageShow,
  collectAppLifeCycle,
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

function runApp(staticConfig, dynamicConfig = {}) {
  let renderer = raxAppRenderer;
  let createAppInstance;
  let pageProps;
  const appConfig = {
    router: {}
  };
  enhanceAppLifeCycle(dynamicConfig);

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
    render,
    Component
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
