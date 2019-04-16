import Host from './vdom/host';
import Element from './vdom/element';
import flattenChildren from './vdom/flattenChildren';

const RESERVED_PROPS = {
  key: true,
  ref: true,
};

function getRenderErrorInfo() {
  const ownerComponent = Host.owner;
  if (ownerComponent) {
    var name = ownerComponent.getName();
    if (name) {
      return ' Check the render method of `' + name + '`.';
    }
  }
  return '';
}

export default function createElement(type, config, children) {
  if (type == null) {
    throw Error('createElement: type should not be null or undefined.' + getRenderErrorInfo());
  }
  // Reserved names are extracted
  let props = {};
  let propName;
  let key = null;
  let ref = null;
  const ownerComponent = Host.owner;

  if (config != null) {
    ref = config.ref === undefined ? null : config.ref;
    key = config.key === undefined ? null : String(config.key);

    if (typeof ref === 'string' && !ownerComponent) {
      console.error('createElement: adding a string ref "' + ref + '" outside the render method.');
    }

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
    if (childrenLength === 1 && !Array.isArray(children)) {
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

  return new Element(
    type,
    key,
    ref,
    props,
    ownerComponent
  );
}

