import { isPlainObject, warn } from './utils';

function preventPropsSet() {
  throw new Error('props can not be set');
}

export default function mixinProps(vm, props, userPropsDef) {
  const _props = {};
  const propsDef = [];
  if (Array.isArray(userPropsDef)) {
    userPropsDef.forEach(propKey => {
      if (typeof propKey === 'string') {
        propsDef.push({ key: propKey });
      } else if (process.env.NODE_ENV !== 'production') {
        warn(
          'props key should be a string, check definition of',
          userPropsDef
        );
      }
    });
  } else if (isPlainObject(userPropsDef)) {
    const keys = Object.keys(userPropsDef);
    for (let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i];
      const defaultVal = userPropsDef[key].default;
      propsDef.push({ key, defaultVal });
    }
  }

  Object.defineProperty(vm, '$props', {
    get() {
      return _props;
    },
  });

  for (let i = 0, l = propsDef.length; i < l; i++) {
    const { key, defaultVal } = propsDef[i];
    _props[key] = props[key] || defaultVal;
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
