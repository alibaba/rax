import { isPlainObject, warn } from './utils';

function preventPropsSet() {
  throw new Error('props can not be set');
}

export default function mixinProps(vm, propsData = {}, propsDefining) {
  const _props = {};
  const formattedPropsDefining = [];
  if (Array.isArray(propsDefining)) {
    propsDefining.forEach(propKey => {
      if (typeof propKey === 'string') {
        formattedPropsDefining.push({ key: propKey });
      } else if (process.env.NODE_ENV !== 'production') {
        warn(
          'props key should be a string, check definition of',
          propsDefining
        );
      }
    });
  } else if (isPlainObject(propsDefining)) {
    const keys = Object.keys(propsDefining);
    for (let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i];
      const defaultVal = propsDefining[key].default;
      formattedPropsDefining.push({ key, defaultVal });
    }
  }

  Object.defineProperty(vm, '$props', {
    get() {
      return _props;
    },
  });

  for (let i = 0, l = formattedPropsDefining.length; i < l; i++) {
    const { key, defaultVal } = formattedPropsDefining[i];
    _props[key] = propsData[key] || defaultVal;
    Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: false,
      get: function() {
        return _props[key];
      },
      set: preventPropsSet,
    });
  }
}
