import { runApp, createApp, createPage, createComponent } from './bridge';
import { useAppEffect, useAppLaunch } from './app';
import { usePageEffect, usePageShow, usePageHide } from './page';
import { useRouter, withRouter, push, replace, go, goBack, goForward, canGo } from './router';
import Component from './component';
import createStyle from './createStyle';

export {
  runApp,
  createApp,
  createPage,
  createComponent,
  createStyle,

  Component,

  // Cycles
  useAppLaunch,
  usePageShow,
  usePageHide,

  // Compatible old version of cycles.
  useAppEffect,
  usePageEffect,

  // Router
  useRouter,
  withRouter,
  push,
  replace,
  go,
  goBack,
  goForward,
  canGo,
};

/* hooks */
export * from './hooks';
