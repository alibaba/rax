import Host from './host';
import Element from './element';

export function jsxRuntime(type, props, key, __source, __self) {
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

  return new Element(
    type,
    key,
    ref,
    normalizedProps,
    Host.owner,
    __source,
    __self
  );
}

