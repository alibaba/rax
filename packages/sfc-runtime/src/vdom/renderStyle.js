// classnames or cx

var hasOwn = {}.hasOwnProperty;
function classNames() {
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
      classes.push(classNames.apply(null, arg));
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
    const [key, val] = rule.split(/:/);
    if (key && val) {
      styleObj[key.trim()] = val.trim();
    }
  });
  return styleObj;
}

export default function renderStyle(classnames, styles = {}, ...args) {
  if (classnames == null) {
    return '';
  }
  const validClasses = classNames(classnames);

  let style = validClasses.map(klass => styles[klass]);

  if (args && args.length) {
    args.forEach((arg) => {
      if (typeof arg === 'string') {
        style.push(transformCSSStyleObject(arg));
      } else if (arg) {
        style.push(arg);
      }
    })
  }

  return style;
}
