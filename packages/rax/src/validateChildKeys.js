import Host from './vdom/host';
import { warning } from './error';
import { isArray } from './types';

/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */
const ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  let info = '';

  const ownerComponent = Host.owner;
  if (ownerComponent) {
    const name = ownerComponent.__getName();
    if (name) {
      info = ` Check the render method of <${name}>.`;
    }
  }

  if (!info) {
    const parentName =
      typeof parentType === 'string'
        ? parentType
        : parentType.displayName || parentType.name;
    if (parentName) {
      info = ` Check the top-level render call using <${parentName}>.`;
    }
  }
  return info;
}

function isValidElement(object) {
  return typeof object === 'object' && object !== null && object.type && !!object.props;
}

function validateExplicitKey(element, parentType) {
  if (element.__validated || element.key != null) {
    return;
  }

  element.__validated = true;

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
    childOwner = ` It was passed a child from <${element._owner.__getName()}>.`;
  }

  warning(`Each child in a list should have a unique "key" prop.${currentComponentErrorInfo}${childOwner}`);
}

export default function validateChildKeys(node, parentType) {
  // Only array or element object is valid child
  if (typeof node !== 'object') {
    return;
  }

  if (isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      const child = node[i];
      if (isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (isValidElement(node)) {
    node.__validated = true;
  }
  // Rax don't support iterator object as element children
  // TODO: add validate when rax support iterator object as element.
}
