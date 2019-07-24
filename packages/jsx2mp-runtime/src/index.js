import { createApp, createPage, createComponent } from './bridge';
import Component from './component';
import createStyle from './createStyle';
import { checkEnv } from './env';

/**
 * Check the runtime environment is compatible.
 */
checkEnv();

export {
  createApp,
  createPage,
  createComponent,

  Component,

  createStyle,
};

/* hooks */
export * from './hooks';
