import Host from './vdom/host';
import Element from './vdom/element';
import { warning, throwError, throwMinifiedWarn } from './error';
import { isArray, NOOP } from './types';
import validateChildKeys from './validateChildKeys';

const __DEV__ = process.env.NODE_ENV !== 'production';

/**
 * This module is adapted to react's jsx-runtime module.
 * @see：[introducing-the-new-jsx-transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.htm)
 */
function jsxRuntime(type, props, key, __source, __self) {
  let normalizedProps = {};
  let propName;

  // The default value of key and ref of rax element is null
  let ref = props && props.ref || null;
  key = key || null;

  for (propName in props) {
    if (propName !== 'ref') {
      normalizedProps[propName] = props[propName];
    }
  }

  let defaults;
  if (typeof type === 'function' && (defaults = type.defaultProps)) {
    for (propName in defaults)
      if (normalizedProps[propName] === undefined) {
        normalizedProps[propName] = defaults[propName];
      }
  }

  return Element(type, key, ref, normalizedProps, Host.owner, __source, __self);
}


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

function jsxWithValidation(type, props, key) {
  return _jsxWithValidation(type, props, key, false);
}
function jsxsWithValidation(type, props, key) {
  return _jsxWithValidation(type, props, key, true);
}
function jsxDEVWithValidation(type, props, key, __source, __self) {
  return _jsxWithValidation(type, props, key, true, __source, __self);
}

const jsx = __DEV__ ? jsxWithValidation : jsxRuntime;
const jsxs = __DEV__ ? jsxsWithValidation : jsxRuntime;
const jsxDEV = __DEV__ ? jsxDEVWithValidation : undefined;

export {
  jsx,
  jsxs,
  jsxDEV,
};

