import { withRouter } from 'rax-use-router';
import { useAppLaunch } from './app';
import { usePageHide, usePageShow } from './page';
import runApp, { setDriver } from './runApp';

export {
  runApp,
  setDriver,
  withRouter,
  useAppLaunch,
  usePageHide,
  usePageShow
};
