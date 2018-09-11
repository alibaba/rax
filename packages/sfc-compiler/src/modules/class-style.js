const { parseStyleText } = require('../utils/style');
const { getAndRemoveAttr, getBindingAttr } = require('../helpers');

const STYLE_OBJECT_VAR = '__styles__';

// not identifier
function isExpression(expOrRef) {
  return /^[_$\w]/i.test(expOrRef);
}

function transformNode(el, options) {
  const classNames = [];

  // <view class="foo" />
  const staticClass = getAndRemoveAttr(el, 'class');
  if (staticClass) {
    const staticClasses = staticClass.split(' ');
    staticClasses.forEach(klass => {
      const val = klass.trim();
      if (val) {
        classNames.push(JSON.stringify(val));
      }
    });
  }

  // <view :class="bar" />
  const classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    classNames.push(isExpression(classBinding) ? 'this.' + classBinding : classBinding);
  }

  // array of classNames, eg. ["foo", this.bar]
  el.classNameStyle = classNames.length === 0 ? '' : `[${classNames.join(',')}]`;

  // <view style="color: red;" />
  const staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    // { "color": "red" }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  // <view :style="styleObject" />
  const styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = isExpression(styleBinding) ? styleBinding : 'this.' + styleBinding;
  }
}

function genData(el) {
  let data = '';
  if (!el.staticStyle && !el.classNameStyle && !el.styleBinding) {
    return data;
  }

  // _cx(classNames, styleObject, ?styleBinding, ?staticStyle);
  const styleArgs = [];
  styleArgs.push(el.classNameStyle || '[]');
  styleArgs.push(STYLE_OBJECT_VAR);
  el.styleBinding && styleArgs.push(el.styleBinding);
  el.staticStyle && styleArgs.push(el.staticStyle);

  data += `style:_cx(${styleArgs.join(',')}),`;
  return data;
}

module.exports = {
  staticKeys: ['className', 'style'],
  transformNode,
  genData
};
