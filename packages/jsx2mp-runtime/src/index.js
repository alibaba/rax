/* eslint-disable import/no-extraneous-dependencies */
import aliAdapter from './adapter/ali';
import wechatAdapter from './adapter/wechat';
import { isMiniApp, isWeChatMiniProgram } from 'universal-env';
import createBridge from './bridge';
import { useAppEffect, useAppLaunch, useAppShow, useAppHide, useAppShare, useAppError } from './app';
import {
  usePageEffect,
  usePageShow,
  usePageHide,
  usePagePullDownRefresh,
  usePageReachBottom,
  usePageScroll,
  useShareAppMessage,
  usePageShare,
  useTabItemTap,
  useTitleClick
} from './page';
import { withRouter } from './router';
import Component from './component';
import createStyle from './createStyle';
import createContext from './createContext';
import classnames from './classnames';
import createRef from './createRef';
import { addNativeEventListener, registerNativeEventListeners } from './nativeEventListener';

let getComponentLifecycle, getComponentBaseConfig;

if (isMiniApp) {
  getComponentLifecycle = aliAdapter.getComponentLifecycle;
  getComponentBaseConfig = aliAdapter.getComponentBaseConfig;
} else if (isWeChatMiniProgram) {
  getComponentLifecycle = wechatAdapter.getComponentLifecycle;
  getComponentBaseConfig = wechatAdapter.getComponentBaseConfig;
}

const { runApp, createPage, createComponent } = createBridge(getComponentLifecycle, getComponentBaseConfig);

export {
  runApp,
  createPage,
  createComponent,
  createStyle,
  createContext,
  classnames,
  createRef,

  Component,

  // Cycles
  useAppLaunch,
  useAppShow,
  useAppHide,
  useAppShare,
  useAppError,

  usePageShow,
  usePageHide,
  usePagePullDownRefresh,
  usePageReachBottom,
  usePageScroll,
  useShareAppMessage,
  usePageShare,
  useTabItemTap,
  useTitleClick,

  // Compatible old version of cycles.
  useAppEffect,
  usePageEffect,

  // Router
  withRouter,

  // Native events
  addNativeEventListener,
  registerNativeEventListeners
};

/* hooks */
export * from './hooks';
