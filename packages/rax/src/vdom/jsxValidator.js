import { throwError, throwMinifiedWarn, warning } from '../error';
import { isArray, NOOP } from '../types';
import validateChildKeys from '../validateChildKeys';
import { jsxRuntime } from './jsx';

const __DEV__ = process.env.NODE_ENV !== 'production';

function _jsxWithValidation(type, props, key, isStaticChildren, __source, __self) {
  const elem = jsxRuntime(type, props, key, __source, __self);

  if (type == null) {
    if (__DEV__) {
      throwError(`Invalid element type, expected a string or a class/function component but got "${type}".`);
    } else {
      // A empty component replaced avoid break render in production
      type = NOOP;
      throwMinifiedWarn(0);
    }
  }

  const children = props && props.children;
  if (children !== undefined) {
    if (isStaticChildren) {
      if (isArray(children)) {
        for (let i = 0; i < children.length; i++) {
          validateChildKeys(children[i], type);
        }

        if (Object.freeze) {
          Object.freeze(children);
        }
      } else {
        warning(
          'Rax.jsx: Static children should always be an array. ' +
          'You are likely explicitly calling Rax.jsxs or Rax.jsxDEV. ' +
          'Use the Babel transform instead.',
        );
      }
    } else {
      validateChildKeys(children, type);
    }
  }

  return elem;
}


export function jsxWithValidationDynamic(type, props, key) {
  return _jsxWithValidation(type, props, key, false);
}
export function jsxWithValidationStatic(type, props, key) {
  return _jsxWithValidation(type, props, key, true);
}
export function jsxWithValidation(type, props, key, __source, __self) {
  return _jsxWithValidation(type, props, key, true, __source, __self);
}
