import { runApp, useAppLaunch, useAppShow, useAppHide, useAppShare, useAppError } from 'rax-app';
import appConfig from './app.json';

useAppLaunch((options) => {
  console.log('app launch', options);
});

useAppShow((options) => {
  console.log('app show', options);
});

useAppHide(() => {
  console.log('app hide');
});

useAppShare(() => {
  return {
    title: '分享标题',
    desc: '分享详细说明',
    path: 'pages/Home/index'
  };
});

useAppError(() => {
  console.log('app error');
});

runApp(appConfig);
