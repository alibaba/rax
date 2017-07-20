import Host from './vdom/host';
import flattenChildren from './flattenChildren';
import {isWeex} from 'universal-env';

const RESERVED_PROPS = {
  key: true,
  ref: true,
};

function getRenderErrorInfo() {
  if (Host.component) {
    var name = Host.component.getName();
    if (name) {
      return ' Check the render method of `' + name + '`.';
    }
  }
  return '';
}

const Element = (type, key, ref, props, owner) => {
  props = filterProps(type, props);

  return {
    // Built-in properties that belong on the element
    type,
    key,
    ref,
    props,
    // Record the component responsible for creating this element.
    _owner: owner,
  };
};

export default Element;

function flattenStyle(style) {
  if (!style) {
    return undefined;
  }

  if (!Array.isArray(style)) {
    return style;
  } else {
    let result = {};
    for (let i = 0; i < style.length; ++i) {
      let computedStyle = flattenStyle(style[i]);
      if (computedStyle) {
        for (let key in computedStyle) {
          result[key] = computedStyle[key];
        }
      }
    }
    return result;
  }
}

// TODO: move to weex-drvier
function filterProps(type, props) {
  // Only for weex text
  if (isWeex && type === 'text') {
    let children = props.children;
    let value = props.value;

    // Value is first
    if (value == null && children != null) {
      if (Array.isArray(children)) {
        children = children.map(function(val) {
          if (typeof val === 'number' || typeof val === 'string') {
            return val;
          } else {
            return '';
          }
        }).join('');
      } else if (typeof children !== 'number' && typeof children !== 'string') {
        children = '';
      }

      props.value = String(children);
    }

    props.children = null;
  }

  return props;
}

export function createElement(type, config, ...children) {
  if (type == null) {
    throw Error('createElement: type should not be null or undefined.' + getRenderErrorInfo());
  }
  // Reserved names are extracted
  let props = {};
  let propName;
  let key = null;
  let ref = null;

  if (config != null) {
    ref = config.ref === undefined ? null : config.ref;
    key = config.key === undefined ? null : String(config.key);
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (config.hasOwnProperty(propName) &&
          !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  if (children.length) {
    props.children = flattenChildren(children);
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

  if (props.style && (Array.isArray(props.style) || typeof props.style === 'object')) {
    props.style = flattenStyle(props.style);
  }

  return new Element(
    type,
    key,
    ref,
    props,
    Host.component
  );
}

export function createFactory(type) {
  const factory = createElement.bind(null, type);
  // Expose the type on the factory and the prototype so that it can be
  // easily accessed on elements. E.g. `<Foo />.type === Foo`.
  // This should not be named `constructor` since this may not be the function
  // that created the element, and it may not even be a constructor.
  factory.type = type;
  return factory;
}

export function cloneElement(element, config, ...children) {
  if (!isValidElement(element)) {
    throw Error('cloneElement: not a valid element.' + getRenderErrorInfo());
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
      owner = Host.component;
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

export function isValidElement(object) {
  return typeof object === 'object' && object !== null && object.type && object.props;
}
