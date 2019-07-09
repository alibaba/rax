import kebabCase from './kebabCase';
/**
 * Create style string.
 * @param style {Object|Array} React like acceptable style props.
 * @return {String} Style expression string inline.
 */
export default function createStyle(style) {
  const styleType = typeof style;
  let ret = '';

  if (Array.isArray(style)) {
    style.forEach((s) => {
      ret += createStyle(s);
    });
  } else if (styleType === 'object') {
    Object.keys(style).forEach((key, index, styleKeys) => {
      const isLast = styleKeys.length - 1 === index;
      ret += `${kebabCase(key)}: ${transformUnit(style[key])};${isLast ? '' : ' '}`;
    });
  } else if (styleType === 'string') {
    ret += style;
  }

  return ret; // Remove last space.
}

function transformUnit(val) {
  if (typeof val === 'number') {
    return val + 'rpx';
  } else {
    return val;
  }
}
