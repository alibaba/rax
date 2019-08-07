import { createApp, createPage, createComponent } from './bridge';
import { useAppEffect } from './app';
import { usePageEffect } from './page';
import { useRouter, withRouter, push, replace, go, goBack, goForward, canGo } from './router';
import Component from './component';
import createStyle from './createStyle';

export {
  createApp,
  createPage,
  createComponent,
  createStyle,

  Component,

  // Cycle
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
