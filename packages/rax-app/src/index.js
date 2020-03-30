import { withRouter } from 'rax-use-router';
import {
  useAppLaunch,
  useAppError,
  useAppHide,
  useAppShare,
  useAppShow,
  usePageNotFound
} from './app';
import { usePageHide, usePageShow } from './page';
import runApp from './runApp';
import {
  registerNativeEventListeners,
  addNativeEventListener,
  removeNativeEventListener
} from './nativeEventListener';

export {
  runApp,
  withRouter,
  useAppLaunch,
  useAppError,
  useAppHide,
  useAppShare,
  useAppShow,
  usePageNotFound,
  usePageHide,
  usePageShow,
  registerNativeEventListeners,
  addNativeEventListener,
  removeNativeEventListener
};
