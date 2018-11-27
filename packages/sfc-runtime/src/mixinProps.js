import { isPlainObject, warn } from './utils';
import { defineReactive } from './observe';

export default function mixinProps(vm, propsData = {}, propsDefining) {
  const _props = {};
  Object.defineProperty(vm, '$props', {
    get() {
      return _props;
    },
  });

  // if no propsDefining in config, no props will be added
  if (!propsDefining) return;

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

  vm._props = _props;

  for (let i = 0, l = formattedPropsDefining.length; i < l; i++) {
    const { key, defaultVal } = formattedPropsDefining[i];

    if (propsData.hasOwnProperty(key)) {
      _props[key] = propsData[key];
    } else {
      _props[key] = defaultVal;
    }

    defineReactive(vm, key, _props[key], {
      afterSetter() {
        vm.forceUpdate();
      },
    });
  }
}
