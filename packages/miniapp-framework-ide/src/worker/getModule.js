import * as app from './app';
import { register } from '../../../miniapp-framework-shared/src/worker/pageHub';

const VALID_MOD_REG = /^@core\//;

/**
 * `require` function in user env.
 */
export default function moduleRequire(mod) {
  if (!VALID_MOD_REG.test(mod)) {
    throw new Error(
      `unknown module ${mod}, only core modules allowed!`
    );
  }
  // @NOTE: pass context by this.
  const context = this;

  switch (mod) {
    case '@core/rax':
      return context.raxInstance;

    case '@core/context':
      return context;

    case '@core/app':
      return app;

    /**
     * If no context provided, only can register a page.
     */
    case '@core/page':
      return context ? context.page : { register };

    // case '@core/console':
    //   if (this && this.clientId) {
    //     return createOrFindConsole(this.clientId);
    //   } else {
    //     return console;
    //   }

    // case '@core/getSchemaData':
      // return getSchemaData;
  }
}
