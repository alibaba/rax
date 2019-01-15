const hasOwnProperty = Object.prototype.hasOwnProperty;

function flatClassNames() {
  let classes = [];
  for (let i = 0; i < arguments.length; i++) {
    let arg = arguments[i];
    if (!arg) continue;
    let argType = typeof arg;
    if (argType === 'string') {
      classes = classes.concat(arg.split(' '));
    } else if (argType === 'number') {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      classes.push(flatClassNames.apply(null, arg));
    } else if (argType === 'object') {
      for (let key in arg) {
        if (hasOwnProperty.call(arg, key) && arg[key]) {
          classes.push(key);
        }
      }
    }
  }
  return [].concat.apply([], classes);
}

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

/**
 * Style order:
 *   1. static inline style
 *   2. inline style with binding
 *   3. CSS Selector style
 * @param styleBinding {Object}
 * @param staticStyle
 */
export default function renderStyle(styleBinding, staticStyle) {
  const style = {};

  /**
   * cssInJS mode will pass 4 args, the other 2 are:
   *   @param styleObject {Object} whole style object.
   *   @param classNames {Array} valid className refs.
   */
  if (arguments.length === 4) {
    const styleObject = arguments[2];
    const validClassNames = flatClassNames(arguments[3]);

    for (let i = 0, l = validClassNames.length; i < l; i ++) {
      const className = validClassNames[i];
      if (hasOwnProperty.call(styleObject, className)) {
        Object.assign(style, styleObject[className]);
      }
    }
  }

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
