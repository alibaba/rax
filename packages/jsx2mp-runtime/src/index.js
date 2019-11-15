import { runApp, createPage, createComponent } from './bridge';
import { useAppEffect, useAppLaunch } from './app';
import {
  usePageEffect,
  usePageShow,
  usePageHide,
  usePagePullDownRefresh,
  usePageReachBottom,
  usePageScroll,
  useShareAppMessage,
  useTabItemTap,
  useTitleClick
} from './page';
import { withRouter } from './router';
import Component from './component';
import createStyle from './createStyle';
import createContext from './createContext';
import classnames from './classnames';

export {
  runApp,
  createPage,
  createComponent,
  createStyle,
  createContext,
  classnames,

  Component,

  // Cycles
  useAppLaunch,
  usePageShow,
  usePageHide,
  usePagePullDownRefresh,
  usePageReachBottom,
  usePageScroll,
  useShareAppMessage,
  useTabItemTap,
  useTitleClick,

  // Compatible old version of cycles.
  useAppEffect,
  usePageEffect,

  // Router
  withRouter,
};

/* hooks */
export * from './hooks';
