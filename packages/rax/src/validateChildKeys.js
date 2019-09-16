import Host from './vdom/host';
import warning from './warning';
import {isArray, isObject} from './types';
import isValidElement from 'rax-is-valid-element/src';

export function getRenderErrorInfo() {
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
  // rax isn't support iterator object as element children
  // TODO: add validate when rax support iterator object as element.
}
