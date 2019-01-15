import Host from './host';
import createEmptyElement from './createEmptyElement';

/**
 * Create MiniApp element.
 * @param type {String|Object} element type.
 * @param props {Object} element props.
 * @param children {Element|Array<Element>} child elements.
 * @return {Element} element.
 */
export default function(type, props, ...children) {
  if (typeof type === 'object' && type.__esModule) {
    type = type.default;
  } else if (type === '$template') {
    if (props.is) {
      return props.is.call(props.pageInstance, props.data);
    } else {
      return createEmptyElement();
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


