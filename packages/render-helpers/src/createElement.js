import Host from './host';

export default function(type, props, ...children) {
  if (typeof type === 'object' && type.__esModule) {
    type = type.default;
  } else if (type === '$template') {
    if (props.is) {
      return props.is.call(props.pageInstance, props.data);
    } else {
      return null;
    }
  }

  // For reduce code size
  // eg: _c(View, undefined, ['xxx'])
  // vs: _c(View, ['xxx'])
  if (Array.isArray(props)) {
    children = props;
    props = undefined;
  }

  return Host.render.createElement(type, props, ...children);
}


