import { shared } from 'rax';
import isValidElement from 'rax-is-valid-element';

const { Host, Element, flattenChildren } = shared;
const RESERVED_PROPS = {
  key: true,
  ref: true,
};

export default function cloneElement(element, config, ...children) {
  if (!isValidElement(element)) {
    throw Error('cloneElement: not a valid element.');
  }

  // Original props are copied
  const props = Object.assign({}, element.props);

  // Reserved names are extracted
  let key = element.key;
  let ref = element.ref;

  // Owner will be preserved, unless ref is overridden
  let owner = element._owner;

  if (config) {
    // Should reset ref and owner if has a new ref
    if (config.ref !== undefined) {
      ref = config.ref;
      owner = Host.owner;
    }

    if (config.key !== undefined) {
      key = String(config.key);
    }

    // Resolve default props
    let defaultProps;
    if (element.type && element.type.defaultProps) {
      defaultProps = element.type.defaultProps;
    }
    // Remaining properties override existing props
    let propName;
    for (propName in config) {
      if (config.hasOwnProperty(propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        if (config[propName] === undefined && defaultProps !== undefined) {
          // Resolve default props
          props[propName] = defaultProps[propName];
        } else {
          props[propName] = config[propName];
        }
      }
    }
  }

  if (children.length) {
    props.children = flattenChildren(children);
  }

  return new Element(
    element.type,
    key,
    ref,
    props,
    owner
  );
};
