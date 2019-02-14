import app from './modules/app';
import page from './modules/page';
import Console from '../../../miniapp-framework-shared/src/console';
import decycle from '../../../miniapp-framework-shared/src/decycle';

const consoleCache = {};
function createOrFindConsole(clientId) {
  return (
    consoleCache[clientId] ||
    (consoleCache[clientId] = new Console({
      sender: function sender(type, args = []) {
        let payload = {};
        if (type === '$switch') {
          payload = {
            type: 'switch',
            value: args,
          };
        } else {
          payload = {
            type,
            args: args.map(arg => decycle(arg)),
          };
        }
        postMessage({
          type: 'console',
          clientId,
          payload,
        });
      },
    }))
  );
}

const VALID_MOD_REG = /^@core\//;
/**
 * 用户的 require 函数
 */
export default function moduleRequire(mod) {
  if (!VALID_MOD_REG.test(mod)) {
    throw new Error(
      `unknown module ${mod}, only core modules allowed!`
    );
  }

  const context = this;

  switch (mod) {
    case '@core/rax':
      return context && context.rax;

    case '@core/app':
      return app;

    case '@core/page':
      if (context) {
        return {
          ...page,
          _context: context,
        };
      } else {
        return page;
      }

    case '@core/console':
      if (context && context.clientId) {
        return createOrFindConsole(this.clientId);
      } else {
        return console;
      }
  }
}
