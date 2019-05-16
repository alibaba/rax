import { createComponent } from './component';
import { createPage } from './page'
import { checkEnv } from './env';

checkEnv();

export {
  /* Base Components */
  createComponent,
  createPage
};

/* hooks */
export * from './hooks';
