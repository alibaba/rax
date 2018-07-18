const { uniqueInstanceID } = require('../utils');
const { parseText } = require('../parser/text-parser');
const { parseStyleText } = require('../utils/style');
const { getAndRemoveAttr, getBindingAttr, baseWarn } = require('../helpers');

const NEED_THIS_REG = /^[_$\w]/i;

function transformNode(el, options) {
  const warn = options.warn || baseWarn;
  const classNames = [];

  const staticClass = getAndRemoveAttr(el, 'class');
  if (process.env.NODE_ENV !== 'production' && staticClass) {
    const expression = parseText(staticClass, options.delimiters);
    if (expression) {
      warn(
        `class="${staticClass}": ` +
        'Interpolation inside attributes has been removed. ' +
        'Use v-bind or the colon shorthand instead. For example, ' +
        'instead of <div class="{{ val }}">, use <div :class="val">.'
      );
    }
  }

  const classBinding = getBindingAttr(el, 'class', false /* getStatic */);

  if (staticClass) {
    const staticClasses = staticClass.split(' ');
    staticClasses.forEach(klass => {
      const val = klass.trim();
      if (val) {
        classNames.push(JSON.stringify(val));
      }
    });
  }
  if (classBinding) {
    classNames.push(classBinding);
  }

  el.classNameStyle =
    classNames.length === 0
      ? ''
      : `[${classNames
        .map(
          className =>
            NEED_THIS_REG.test(className) ? `this.${className}` : className
        )
        .join(',')}]`;

  // handle style
  const staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      const expression = parseText(staticStyle, options.delimiters);
      if (expression) {
        warn(
          `style="${staticStyle}": ` +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div style="{{ val }}">, use <div :style="val">.'
        );
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  const styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData(el) {
  const styleTag = '_st';
  let data = '';
  if (!el.staticStyle && !el.classNameStyle && !el.styleBinding) {
    return data;
  }

  if (el.styleBinding && NEED_THIS_REG.test(el.styleBinding)) {
    el.styleBinding = 'this.' + el.styleBinding;
  }

  data += `style:_cx(${
    el.classNameStyle ? el.classNameStyle : '!1'
    },${styleTag},${el.styleBinding ? el.styleBinding : '!1'},${
    el.staticStyle ? el.staticStyle : '!1'
    }),`;

  return data;
}

module.exports = {
  staticKeys: ['className', 'style'],
  transformNode,
  genData
};
