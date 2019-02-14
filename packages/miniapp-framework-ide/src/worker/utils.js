import createErrorPage from '../../../miniapp-framework-shared/packages/error-page/src';
import getModule from './getModule';
import raxCode from '!!raw-loader!rax';

const genRax = new Function('module', 'exports', raxCode);

/**
 * Create a unique rax instance.
 */
export function createRax() {
  return applyFactory(genRax);
}

/**
 * Create component by factory
 */
export function applyFactory(factory, context = {}) {
  const module = { exports: null };
  factory(module, module.exports, getModule.bind(context));
  return interopRequire(module.exports);
}

/**
 * Compatible with ES Modules -> commonjs2
 */
function interopRequire(obj) {
  return obj && typeof obj.default !== 'undefined' ? obj.default : obj;
}
