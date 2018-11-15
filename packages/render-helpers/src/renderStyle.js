function transformCSSStyleObject(str) {
  const styleObj = {};
  str.split(';').forEach(rule => {
    const [key, val] = rule.split(/:(.+)/);
    if (key && val) {
      styleObj[key.trim()] = val.trim();
    }
  });
  return styleObj;
}

export default function renderStyle(styleBinding, staticStyle) {
  const style = {};

  /**
   * Handle style with Array binding
   */
  if (Array.isArray(styleBinding)) {
    styleBinding = styleBinding.reduce((iter, curr) => Object.assign(iter, curr), {});
  }

  if (typeof styleBinding === 'string') {
    Object.assign(style, transformCSSStyleObject(styleBinding));
  } else if (typeof styleBinding === 'object') {
    Object.assign(style, styleBinding);
  }
  if (typeof staticStyle === 'string') {
    Object.assign(style, transformCSSStyleObject(staticStyle));
  } else if (typeof staticStyle === 'object') {
    Object.assign(style, staticStyle);
  }

  return style;
}
