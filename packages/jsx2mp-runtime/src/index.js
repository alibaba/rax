import { createComponent } from './component';
import { checkEnv } from './env';

checkEnv();

export {
  /* Base Components */
  createComponent,
};

/* hooks */
export * from './hooks';
