import { createApp, createPage, createComponent } from './bridge';
import Component from './component';
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
};

/* hooks */
export * from './hooks';
