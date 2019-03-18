import * as app from './lifecycles/app';
import * as page from './lifecycles/page';
import Console from 'miniapp-framework-shared/src/console';
import { worker, decycle } from 'miniapp-framework-shared';
import createErrorPage from 'miniapp-framework-shared/src/errorPage';

const registerPage = worker.pageHub.register;
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

const appModule = {
  on: app.on,
  off: app.off,
  register: registerApp,
};
const pageModule = {
  on: page.on,
  off: page.off,
  register: registerPage,
};

export default function getModule(mod) {
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
      return appModule;

    case '@core/page':
      if (context) {
        return {
          ...pageModule,
          _context: context,
        };
      } else {
        return pageModule;
      }

    case '@core/console':
      if (context && context.clientId) {
        return createOrFindConsole(this.clientId);
      } else {
        return console;
      }
  }
}

/**
 * Execute factory immediately
 * @param description {Any}
 * @param factory {Function}
 */
function registerApp(description, factory) {
  applyFactory(factory);
}

export function applyFactory(factory, context = {}) {
  const module = { exports: null };
  factory(module, module.exports, function(mod) {
    if (mod === '@core/context') {
      return context;
    } else {
      return getModule.call(context, mod);
    }
  });
  const component = interopRequire(module.exports);
  return null === component && context.rax ? createErrorPage({
    require: getModule,
    createElement: context.rax.createElement,
    message: '找不到页面'
  }) : component;
}

function interopRequire(obj) {
  return obj && typeof obj.default !== 'undefined' ? obj.default : obj;
}
