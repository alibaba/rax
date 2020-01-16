import { runApp, createPage, createComponent } from './bridge';
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
import { addNativeEventListener, registerNativeEventListeners } from "./nativeEventListener";

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
