import Host from './vdom/host';
import Element from './vdom/element';
import flattenChildren from './vdom/flattenChildren';
import { invokeMinifiedError } from './error';
import { isString, isArray } from './types';
import warning from './warning';
import validateChildKeys from './validateChildKeys';
import getRenderErrorInfo from './getRenderErrorInfo';

const RESERVED_PROPS = {
  key: true,
  ref: true,
};

export default function createElement(type, config, children) {
  if (type == null) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('createElement: type should not be null or undefined.' + getRenderErrorInfo());
    } else {
      invokeMinifiedError(0);
    }
  }
  // Reserved names are extracted
  let props = {};
  let propName;
  let key = null;
  let ref = null;
  const ownerComponent = Host.owner;

  if (config != null) {
    let hasReservedProps = false;

    if (config.ref != null) {
      hasReservedProps = true;
      ref = config.ref;
      if (process.env.NODE_ENV !== 'production') {
        if (isString(ref) && !ownerComponent) {
          warning('createElement: adding a string ref "' + ref + '" outside the render method.');
        }
      }
    }

    if (config.key != null) {
      hasReservedProps = true;
      key = '' + config.key;
    }

    // If no reserved props, assign config to props for better performance
    if (hasReservedProps) {
      for (propName in config) {
        // Extract reserved props
        if (!RESERVED_PROPS[propName]) {
          props[propName] = config[propName];
        }
      }
    } else {
      props = config;
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

  if (process.env.NODE_ENV !== 'production') {
    for (let i = 2; i < arguments.length; i ++) {
      validateChildKeys(arguments[i], type);
    }
  }

  return new Element(
    type,
    key,
    ref,
    props,
    ownerComponent
  );
}

