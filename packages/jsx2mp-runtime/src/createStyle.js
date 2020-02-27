import kebabCase from './kebabCase';
import { isArray, isObject, isString, isNull } from './types';
/**
 * Create style string.
 * @param style {Object|Array} React like acceptable style props.
 * @return {String} Style expression string inline.
 */
export default function createStyle(style) {
  if (isNull(style)) return '';

  let ret = '';

  if (isArray(style)) {
    style.forEach((s) => {
      ret += createStyle(s);
    });
  } else if (isObject(style)) {
    Object.keys(style).forEach((key, index, styleKeys) => {
      const isLast = styleKeys.length - 1 === index;
      ret += `${kebabCase(key)}: ${transformUnit(style[key])};${isLast ? '' : ' '}`;
    });
  } else if (isString(style)) {
    ret += style;
  }

  return ret; // Remove last space.
}

function transformUnit(val) {
  return val;
}
