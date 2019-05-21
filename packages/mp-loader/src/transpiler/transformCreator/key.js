const { getAndRemoveAttr, normalizeMustache } = require('../helpers');

const IS_BIND_REG = /\W*\{\{/;

function createTransformNode(attrKey) {
  return function(el) {
    let key;
    if (el.hasOwnProperty('key') && IS_BIND_REG.test(el.key)) {
      key = normalizeMustache(el.key, el);
    } else if (el.attrsMap && el.attrsMap.hasOwnProperty(attrKey)) {
      key = getAndRemoveAttr(el, attrKey);
    }

    if (key) {
      el.key = key;
    }
  };
}

module.exports = {
  createTransformNode
};
