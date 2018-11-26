const hasOwn = {}.hasOwnProperty;

function flatClassNames() {
  var classes = [];
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    if (!arg) continue;
    var argType = typeof arg;
    if (argType === 'string') {
      classes = classes.concat(arg.split(' '));
    } else if (argType === 'number') {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      classes.push(flatClassNames.apply(null, arg));
    } else if (argType === 'object') {
      for (var key in arg) {
        if (hasOwn.call(arg, key) && arg[key]) {
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

  /**
   * cssInJS mode will pass 4 args.
   *   @param styleObject {Object}
   *   @param classNames {Array} valid classNames refs.
   */
  if (arguments.length === 4) {
    const styleObject = arguments[2];
    const validClassNames = flatClassNames(arguments[3]);

    for (let i = 0, l = validClassNames.length; i < l; i ++) {
      const className = validClassNames[i];
      if (hasOwn.call(styleObject, className)) {
        Object.assign(style, styleObject[className]);
      }
    }
  }

  return style;
}
