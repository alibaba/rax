import { withRouter, useHistory, useLocation } from 'rax-use-router';
import { useAppLaunch } from './app';
import { usePageHide, usePageShow } from './page';
import runApp from './runApp';

export {
  runApp,
  useAppLaunch,
  usePageHide,
  usePageShow,
  // router
  withRouter,
  useHistory,
  useLocation
};
