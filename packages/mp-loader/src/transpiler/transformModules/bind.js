const {
  getAndRemoveAttr,
  addAttr,
  camelize,
  isPreservedPropName
} = require('../helpers');

const IS_BIND_REG = /\W*\{\{/;

const { getAdapter } = require('../adapter');

const adapter = getAdapter();

function transformNode(el) {
  const { attrsList, attrsMap } = el;
  const { IS_DETECTIVE } = adapter;
  if (!attrsList) {
    return;
  }
  const keys = attrsList.map(({name}) => name);
  for (let i = 0, l = keys.length; i < l; i++) {
    transformAttr({
      name: keys[i],
      value: attrsMap[keys[i]]
    });
  }

  function transformAttr(attr) {
    const { name, value } = attr;
    if (IS_DETECTIVE.test(name)) {
      return;
    }

    if (IS_BIND_REG.test(value)) {
      const exp = getAndRemoveAttr(el, name);
      const transformedName = isPreservedPropName(name) ? name : camelize(name);
      addAttr(el, transformedName, exp, '');
    }
  }
};


module.exports = {
  transformNode
};
