import router from './router';
import {
  useAppLaunch,
  useAppError,
  useAppHide,
  useAppShare,
  useAppShow,
  usePageNotFound
} from './app';
import { usePageHide, usePageShow, withPageLifeCycle } from './page';
import runApp from './runApp';
import {
  registerNativeEventListeners,
  addNativeEventListener,
  removeNativeEventListener
} from './nativeEventListener';

const withRouter = router.withRouter;

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
  withPageLifeCycle,
  registerNativeEventListeners,
  addNativeEventListener,
  removeNativeEventListener
};
