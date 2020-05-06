import { runApp, createComponent, createPage } from './bridge';
import { useAppLaunch, useAppShow, useAppHide, useAppShare, useAppError } from './app';
import { usePageShow, usePageHide} from './page';
import { withRouter } from './router';
import Component from './component';
import createStyle from './createStyle';
import createContext from './createContext';
import classnames from './classnames';
import createRef from './createRef';
import { addNativeEventListener, removeNativeEventListener, registerNativeEventListeners } from './nativeEventListener';
import memo from './memo';
import version from './version';
import forwardRef from './forwardRef';

// Adapter rax core
const shared = {};

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

  // Router
  withRouter,

  // Native events
  addNativeEventListener,
  removeNativeEventListener,
  registerNativeEventListeners,

  // Shared
  shared,
  // Memo
  memo,

  // Version
  version,

  // ForwardRef
  forwardRef
};

/* hooks */
export * from './hooks';
