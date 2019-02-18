/**
 * 获取 global 对象
 */
export function getGlobalContext() {
  if (typeof self !== 'undefined') {
    return self;
  } else {
    return eval('this');
  }
}

import raxCode from '!!raw-loader!rax';

const genRax = new Function('module', 'exports', raxCode);

/**
 * create a unique rax
 */
export function createRax() {
  return applyFactory(genRax);
}

import createErrorPage from 'miniapp-framework-shared/src/errorPage';
import require from './getModule';
/**
 * create component by factory
 */
export function applyFactory(factory, context = {}) {
  const module = { exports: null };
  factory(module, module.exports, function(mod) {
    if (mod === '@core/context') {
      return context;
    } else {
      return require.call(context, mod);
    }
  });
  const component = interopRequire(module.exports);
  return null === component && context.rax ? createErrorPage({
    require,
    createElement: context.rax.createElement,
    message: '找不到页面'
  }) : component;
}

/**
 * compatible with ES Modules -> commonjs2
 */
function interopRequire(obj) {
  return obj && typeof obj.default !== 'undefined' ? obj.default : obj;
}
