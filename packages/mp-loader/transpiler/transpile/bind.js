const { getAndRemoveAttr, addAttr, normalizeMustache } = require('../helpers');

const IS_BIND_REG = /\W*\{\{/;
const IS_DETECTIVE = /^a\:/;
function transformNode(el) {
  const { attrsList, attrsMap } = el;

  if (el.hasOwnProperty('key') && IS_BIND_REG.test(el.key)) {
    const exp = normalizeMustache(el.key, el);
    addAttr(el, 'key', exp);
  }

  if (!attrsList) {
    return;
  }

  const list = Object.keys(attrsMap);
  for (let i = 0, l = list.length; i < l; i++) {
    transformAttr({
      name: list[i],
      value: attrsMap[list[i]]
    });
  }

  function transformAttr(attr) {
    const { name, value } = attr;
    if (name === 'class' || name === 'style') {
      return;
    }
    if (IS_DETECTIVE.test(name)) {
      return;
    }
    if (IS_BIND_REG.test(value)) {
      const exp = getAndRemoveAttr(el, name);
      addAttr(el, name, exp, '');
    }
  }
}

module.exports = {
  transformNode
};
