import Host from './vdom/host';
import Element from './vdom/element';
import flattenChildren from './vdom/flattenChildren';
import { warning, throwError, throwMinifiedWarn } from './error';
import { isString, isArray, NOOP } from './types';
import validateChildKeys from './validateChildKeys';

const RESERVED_PROPS = {
  key: true,
  ref: true,
};

export default function createElement(type, config, children) {
  // Reserved names are extracted
  let props = {};
  let propName;
  let key = null;
  let ref = null;

  if (config != null) {
    ref = config.ref === undefined ? null : config.ref;
    key = config.key === undefined ? null : '' + config.key;

    // Remaining properties are added to a new props object
    for (propName in config) {
      if (!RESERVED_PROPS[propName]) {
        props[propName] = config[propName];
      }
    }
  }

  // Children arguments can be more than one
  const childrenLength = arguments.length - 2;
  if (childrenLength > 0) {
    if (childrenLength === 1 && !isArray(children)) {
      props.children = children;
    } else {
      let childArray = children;
      if (childrenLength > 1) {
        childArray = new Array(childrenLength);
        for (var i = 0; i < childrenLength; i++) {
          childArray[i] = arguments[i + 2];
        }
      }
      props.children = flattenChildren(childArray);
    }
  }

  // Resolve default props
  if (type && type.defaultProps) {
    let defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  if (type == null) {
    if (process.env.NODE_ENV !== 'production') {
      throwError(`Invalid element type, expected a string or a class/function component but got "${type}".`);
    } else {
      // A empty component replaced avoid break render in production
      type = NOOP;
      throwMinifiedWarn(0);
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    if (isString(ref) && !Host.owner) {
      warning(
        `Adding a string ref "${ref}" that was not created inside render method, or multiple copies of Rax are used.`
      );
    }

    for (let i = 2; i < arguments.length; i ++) {
      validateChildKeys(arguments[i], type);
    }
  }

  return new Element(
    type,
    key,
    ref,
    props,
    Host.owner
  );
}

