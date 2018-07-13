const { getAndRemoveAttr, addAttr, normalizeMustache } = require('../helpers');

const IS_BIND_REG = /\W*\{\{/;
function transformNode(el) {
  const { attrsList } = el;

  if (el.hasOwnProperty('key') && IS_BIND_REG.test(el.key)) {
    const exp = normalizeMustache(el.key, el);
    addAttr(el, 'key', exp);
  }

  if (!attrsList) {
    return;
  }
  attrsList.forEach(transformAttr);

  function transformAttr(attr) {
    const { name, value } = attr;
    if (IS_BIND_REG.test(value)) {
      const exp = getAndRemoveAttr(el, name);
      addAttr(el, name, exp, '');
    }
  }
}

module.exports = {
  transformNode
};
