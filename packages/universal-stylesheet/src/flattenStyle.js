export default function flattenStyle(style) {
  if (!style) {
    return undefined;
  }

  if (!Array.isArray(style)) {
    return style;
  } else {
    let result = {};
    for (let i = 0; i < style.length; ++i) {
      let computedStyle = flattenStyle(style[i]);
      if (computedStyle) {
        for (let key in computedStyle) {
          result[key] = computedStyle[key];
        }
      }
    }
    return result;
  }
};
