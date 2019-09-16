import Host from './vdom/host';
import Element from './vdom/element';
import flattenChildren from './vdom/flattenChildren';
import { invokeMinifiedError } from './error';
import { isString, isArray, isObject } from './types';
import warning from './warning';
import isValidElement from 'rax-is-valid-element/src';

const RESERVED_PROPS = {
  key: true,
  ref: true,
};

function getRenderErrorInfo() {
  const ownerComponent = Host.owner;
  if (ownerComponent) {
    const name = ownerComponent.__getName();
    if (name) {
      return ' Check the render method of `' + name + '`.';
    }
  }
  return '';
}

/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */
const ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  let info = getRenderErrorInfo();

  if (!info) {
    const parentName =
      typeof parentType === 'string'
        ? parentType
        : parentType.displayName || parentType.name;
    if (parentName) {
      info = `\n\nCheck the top-level render call using <${parentName}>.`;
    }
  }
  return info;
}

function validateExplicitKey(element, parentType) {
  if (!element._store || element._store.validated || element.key != null) {
    return;
  }

  element._store.validated = true;

  const currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
  if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
    return;
  }
  ownerHasKeyUseWarning[currentComponentErrorInfo] = true;

  // Usually the current owner is the offender, but if it accepts children as a
  // property, it may be the creator of the child that's responsible for
  // assigning it a key.
  let childOwner = '';
  if (
    element &&
    element._owner &&
    element._owner !== Host.owner
  ) {
    // Give the component that originally created this child.
    childOwner = ` It was passed a child from ${element._owner.__getName()}.`;
  }

  warning(
    'Each child in a list should have a unique "key" prop.%s%s',
    currentComponentErrorInfo,
    childOwner
  );
}

export function validateChildKeys(node, parentType) {
  if (!isObject(node)) {
    return;
  }

  if (isArray(node)) {
    for (let i = 0; i < node.length; i ++) {
      const child = node[i];
      if (isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (isValidElement(node)) {
    if (node._store) {
      node._store.validated = true;
    }
  }
  // it seems that rax isn't support iterator object as element children
  // TODO add validate when rax support iterator object as element.
}

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

    // if no reserved props, assign config to props for better performance
    if (hasReservedProps) {
      for (propName in config) {
        // extract reserved props
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

