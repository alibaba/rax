import { isString, isNumber, isArray, isObject } from './types';

/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
const hasOwn = {}.hasOwnProperty;

export default function classNames() {
  const classes = [];

  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i];
    if (!arg) continue;

    if (isString(arg) || isNumber(arg)) {
      classes.push(arg);
    } else if (isArray(arg) && arg.length) {
      const inner = classNames.apply(null, arg);
      if (inner) {
        classes.push(inner);
      }
    } else if (isObject(arg)) {
      for (let key in arg) {
        if (hasOwn.call(arg, key) && arg[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}
