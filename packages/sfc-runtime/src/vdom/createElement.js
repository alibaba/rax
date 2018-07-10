import { processPropsData } from '../utils';
import { get } from '../store';

export default function _createElement(type, props, children) {
  let createElement;
  if (this && typeof this.createElement === 'function') {
    createElement = this.createElement;
  } else {
    createElement = get('c');
  }

  if (type === '$template') {
    if (props.is) {
      const data = processPropsData(props, this);
      return props.is.call(this.ctx, data);
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


