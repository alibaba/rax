const { getAndRemoveAttr } = require('../helpers');

const ATTR_KEY = 'a:key';

function transformNode(el, state) {
  if (el.attrsMap[ATTR_KEY] !== undefined) {
    el.key = getAndRemoveAttr(el, ATTR_KEY);
  }
}

module.exports = {
  transformNode
};
