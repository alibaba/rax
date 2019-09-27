import { runApp, createPage, createComponent } from './bridge';
import { useAppEffect, useAppLaunch } from './app';
import { usePageEffect, usePageShow, usePageHide } from './page';
import { withRouter } from './router';
import Component from './component';
import createStyle from './createStyle';

export {
  runApp,
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
  withRouter,
};

/* hooks */
export * from './hooks';
