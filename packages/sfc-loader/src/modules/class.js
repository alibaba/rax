const isValidIdentifier = require('is-valid-identifier');
const { getAndRemoveAttr, getBindingAttr } = require('sfc-compiler/src/helpers');

function transformNode(el) {
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

  /**
   * <view :class="bar" />
   * or
   * <view :class="{ bar: true }" />
   */
  const classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    classNames.push(isValidIdentifier(classBinding) ? 'this.' + classBinding : classBinding);
  }

  // array of classNames, eg. ["foo", this.bar]
  el.classNameStyle = classNames.length === 0 ? '' : `[${classNames.join(',')}]`;
}

function genData(el) {
  let data = '';

  if (el.classNameStyle) {
    data += `class:${el.classNameStyle}.join(' '),`;
  }

  return data;
}

module.exports = {
  staticKeys: ['className'],
  transformNode,
  genData
};
