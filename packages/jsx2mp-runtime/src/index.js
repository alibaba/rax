import { createComponent } from './Component';
import { checkEnv } from './env';

checkEnv();

export {
  /* Base Components */
  createComponent,
};

/* hooks */
export * from './hooks';
