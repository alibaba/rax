const { getAndRemoveAttr, normalizeMustache } = require('../helpers');

const IS_BIND_REG = /\W*\{\{/;
const { getAdapter } = require('../adapter');

const adapter = getAdapter();


function transformNode(el) {
  let key;
  const { ATTR_KEY } = adapter;
  if (el.hasOwnProperty('key') && IS_BIND_REG.test(el.key)) {
    key = normalizeMustache(el.key, el);
  } else if (el.attrsMap && el.attrsMap.hasOwnProperty(ATTR_KEY)) {
    key = getAndRemoveAttr(el, ATTR_KEY);
  }

  if (key) {
    el.key = key;
  }
};

module.exports = {
  transformNode
};
