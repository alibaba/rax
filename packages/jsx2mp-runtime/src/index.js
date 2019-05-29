import { createApp } from './app';
import { createPage, createComponent } from './page';
import { Component } from './baseComponent';
import { checkEnv } from './env';

/**
 * Check the runtime environment is compatible.
 */
checkEnv();

export {
  createApp,
  createPage,
  Component,
  createComponent,
};

/* hooks */
export * from './hooks';
