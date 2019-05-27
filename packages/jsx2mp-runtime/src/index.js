import { createApp } from './app';
import { createPage } from './page';
import { createComponent } from './component';
import { checkEnv } from './env';

/**
 * Check the runtime environment is compatible.
 */
checkEnv();

export {
  createApp,
  createPage,
  /* Base Components */
  createComponent,
};

/* hooks */
export * from './hooks';
