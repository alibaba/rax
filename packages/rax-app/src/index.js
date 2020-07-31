import { createElement, useState, useEffect, Fragment } from 'rax';
import { withRouter as raxWithRouter } from 'rax-use-router';
import createShareAPI from '@ice/create-app-shared';
import raxRenderer from '@ice/rax-renderer';
import miniappRenderer from '@ice/miniapp-renderer';
import { isWeChatMiniProgram, isMiniApp, isByteDanceMicroApp, isWeb } from 'universal-env';
import App from './App';
import { enhanceAppLifeCycle, useAppLaunch, useAppShare, useAppError, useAppShow, useAppHide, usePageNotFound } from './appLifyCycles';

const initialDataFromSSR = global.__INITIAL_DATA__;

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
  let renderer = raxRenderer;
  let createAppInstance;
  enhanceAppLifeCycle(dynamicConfig);
  const appConfig = {
    app: Object.assign({
      rootId: 'root',
    }, dynamicConfig),
    router: {}
  };
  const { shell, routes } = staticConfig;
  if (isWeChatMiniProgram, isMiniApp, isByteDanceMicroApp) {
    renderer = miniappRenderer;
  } else {
    createAppInstance = (initialComponent) => {
      const history = getHistory();
      let appInstance = createElement(App, {
        appConfig: staticConfig,
        history,
        routes,
        pageProps: !dynamicConfig.dynamicConfig && dynamicConfig,
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
      } else if (isWeb) {
        type = 'hash';
      }
      const history = createHistory({ routes, customHistory: staticConfig.history, type });
      appConfig.router.history = history;
      collectAppLifeCycle(appConfig);
      return {
        appConfig
      };
    },
    createHistory,
    staticConfig,
    appConfig,
    getHistory,
    pathRedirect,
    createAppInstance,
    emitLifeCycles
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
