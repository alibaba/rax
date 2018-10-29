import Host from './host';

/**
* For template include
*/
function processPropsData(props = {}, self = {}) {
  const data = Object.create(props.data || {});
  const { pageInstance } = props;

  Object.keys(props.data || {})
    .forEach((key) => {
      const val = props.data[key];
      if (typeof val === 'string') {
        data[key] = pageInstance && typeof pageInstance[val] === 'function'
          ? pageInstance[val].bind(pageInstance) : val;
      }
    });
  return data;
}

export default function(type, props, ...children) {

  if (typeof type === 'object' && type.__esModule) {
    type = type.default;
  } else if (type === '$template') {
    if (props.is) {
      const data = processPropsData(props, this);
      return props.is.call(props.pageInstance, data);
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

  // For array mutation
  for (let prop in props) {
    if (Array.isArray(props[prop])) {
      props[prop] = [...props[prop]];
    }
  }

  return Host.render.createElement(type, props, ...children);
}


