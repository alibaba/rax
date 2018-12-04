import { isPlainObject, isObject } from './utils';
import { arrayPatchMethods } from './const';
import Dep from './Dep';

const arrayProto = Array.prototype;

function createArrayDelegate(opts) {
  const arrayMethods = Object.create(arrayProto);
  arrayPatchMethods.forEach(function(method) {
    // hijack
    const originalMethod = arrayProto[method];
    Object.defineProperty(arrayMethods, method, {
      value: function(...args) {
        const ob = this.__ob__;
        const result = originalMethod.apply(this, args);
        let inserted;
        switch (method) {
          case 'push':
          case 'unshift':
            inserted = args;
            break;
          case 'splice':
            inserted = args.slice(2);
            break;
        }
        if (inserted) {
          ob.observeArray(inserted);
        }

        if (typeof opts.afterSetter === 'function') {
          opts.afterSetter(this);
        }
        // notify change
        ob.dep.notify();
        return result;
      },
      enumerable: true,
      writable: true,
      configurable: true
    });
  });
  return arrayMethods;
}

function observe(value, options) {
  if (!isObject(value)) {
    return;
  }

  if (
    value
    && Object.hasOwnProperty.call(value, '__ob__')
    && value.__ob__ instanceof Observer
  ) {
    return value.__ob__;
  }
  return new Observer(value, options);
}


class Observer {
  constructor(value, options) {
    this.value = value;
    this.dep = new Dep();

    Object.defineProperty(value, '__ob__', {
      value: this,
      enumerable: false,
      writable: true,
      configurable: true
    });

    if (Array.isArray(value)) {
      // delegate array methods
      value.__proto__ = createArrayDelegate(options);
      this.observeArray(value, options);
    } else if (isPlainObject(value)) {
      this.walk(value, options);
    }
  }

  walk(obj, opt) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], undefined, opt);
    }
  }

  observeArray(items, options) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i], options);
    }
  }
}

/**
 * vue observe function
 */
export function defineReactive(obj, key, val, opts = {}) {
  const dep = new Dep();
  const property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get;
  const setter = property && property.set;
  if ((!getter || setter) && typeof val === 'undefined') {
    val = obj[key];
  }

  let parents = [];
  if (Array.isArray(opts.parents)) {
    parents = parents.concat(opts.parents);
  }
  parents.push(key);

  let children = observe(val, {
    ...opts, parents
  });

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (children) {
          children.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val;
      // 值不变的时候不触发
      if (newVal === value || newVal !== newVal && value !== value) {
        return;
      }

      dep.notify();

      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }

      if (typeof opts.afterSetter === 'function') {
        opts.afterSetter(newVal);
      }

      children = observe(newVal, {
        ...opts, parents
      });
      dep.notify();
    }
  });
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray(value) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

export default observe;
