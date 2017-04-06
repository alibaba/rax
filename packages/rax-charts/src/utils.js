const utils = {
  isArray: arr => {
    if (Array.isArray) {
      return Array.isArray(arr);
    } else {
      return Object.prototype.toString.call(arr) === '[object Array]';
    }
  },

  isFunction: func => {
    return func
      && typeof func === 'function'
      && Object.prototype.toString.call(func) === '[object Function]';
  },

  isNumber: number => {
    return number
      && typeof number === 'number'
      && Object.prototype.toString.call(number) === '[object Number]';
  },

  isObject: object => {
    return object
      && typeof object === 'object'
      && Object.prototype.toString.call(object) === '[object Object]';
  },
};

export default utils;
