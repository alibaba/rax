import Host from './vdom/host';
import { scheduler } from './vdom/scheduler';
import { NOOP, isPlainObject } from './types';

function createMinifiedError(type, code, obj) {
  var typeInfo = obj === undefined ? '' : ' got: ' + getTypeInfo(obj);
  return new Error(`${type}: #${code}, ${getRenderErrorInfo()}.` + typeInfo);
}

export function getTypeInfo(obj) {
  return isPlainObject(obj) ? Object.keys(obj) : obj;
}

export function getRenderErrorInfo() {
  const ownerComponent = Host.owner;
  return ownerComponent ? `check <${ownerComponent.__getName()}>` : 'no owner';
}

/**
 * Minified code:
 *  1: Hooks called outside a component, or multiple version of Rax are used.
 *  6: Invalid component type, expected a class or function component.
 *  4: Too many re-renders, the number of renders is limited to prevent an infinite loop.
 *  5: Rax driver not found.
 * @param code {Number}
 * @param obj {Object}
 */
export function throwMinifiedError(code, obj) {
  throw createMinifiedError('Error', code, obj);
}

/**
 * Minified Code:
 * 0: Invalid element type, expected a string or a class/function component but got "null" or "undefined".
 * 2. Invalid child type, expected types: Element instance, string, boolean, array, null, undefined.
 * 3. Ref can not attach because multiple copies of Rax are used.
 * @param {number} code
 * @param {string} info
 */
export function throwMinifiedWarn(code, obj) {
  let err = createMinifiedError('Warn', code, obj);
  scheduler(() => {
    throw err;
  }, 0);
}

export function throwError(message, obj) {
  let typeInfo = obj === undefined ? '' :
    '(found: ' + (isPlainObject(obj) ? `object with keys {${Object.keys(obj)}}` : obj) + ')';

  throw Error(`${message} ${typeInfo}`);
}

export let warning = NOOP;

if (process.env.NODE_ENV !== 'production') {
  warning = (template, ...args) => {
    if (typeof console !== 'undefined') {
      let argsWithFormat = args.map(item => '' + item);
      argsWithFormat.unshift('Warning: ' + template);
      // Don't use spread (or .apply) directly because it breaks IE9
      Function.prototype.apply.call(console.error, console, argsWithFormat);
    }

    // For works in DevTools when enable `Pause on caught exceptions`
    // that can find the component where caused this warning
    try {
      let argIndex = 0;
      const message = 'Warning: ' + template.replace(/%s/g, () => args[argIndex++]);
      throw new Error(message);
    } catch (e) {}
  };
}

