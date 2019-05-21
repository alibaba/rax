import { createComponent } from './component';
import { createPage } from './page';
import { checkEnv } from './env';

/**
 * Check the runtime environment is compatible.
 */
checkEnv();

export {
  /* Base Components */
  createComponent,
  createPage,
};

/* hooks */
export * from './hooks';
