import { processPropsData } from '../utils';
import Host from '../host';

export default function(type, props, children) {
  const createElement = Host.createElement;

  if (typeof type === 'object' && type.__esModule === true) {
    type = type.default;
  }

  if (type === '$template') {
    if (props.is) {
      const data = processPropsData(props, this);
      return props.is.call(props.pageInstance, data);
    } else {
      return null;
    }
  }
  // for reduce code size
  // eg: _c(View, undefined, ['xxx'])
  // vs: _c(View, ['xxx'])
  if (Array.isArray(props)) {
    children = props;
    props = undefined;
  }

  /**
   * for array mutation
   */
  for (let prop in props) {
    if (Array.isArray(props[prop])) {
      props[prop] = [...props[prop]];
    }
  }

  return createElement(type, props, children);
}


