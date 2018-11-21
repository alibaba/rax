import Host from './host';

const hasOwnProperty = Object.prototype.hasOwnProperty;

export default function(type, props, ...children) {
  if (typeof type === 'object' && type.__esModule) {
    type = type.default;
  } else if (type === '$template') {
    if (props.is) {
      /**
       * Template Data default to an empty object:
       * <view val="{{val}}" /> will be generated as
       *   _c('view', { val: data.val });
       * Should not throw exception if no data were passed.
       */
      const templateData = hasOwnProperty.call(props, 'data') ? props.data : {};
      return props.is.call(props.pageInstance, templateData);
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


