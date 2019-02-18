import createErrorPage from 'miniapp-framework-shared/src/errorPage';
import raxCode from 'text!../node_modules/rax/dist/rax.min.js';
import getModule from './getModule';

const generateRax = new Function('module', 'exports', raxCode);

/**
 * Create a rax instance.
 */
export function createRax() {
  return applyFactory(generateRax);
}

/**
 * Create component by factory
 */
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

/**
 * Compatible with ES Modules -> commonjs2
 */
function interopRequire(obj) {
  return obj && typeof obj.default !== 'undefined' ? obj.default : obj;
}
