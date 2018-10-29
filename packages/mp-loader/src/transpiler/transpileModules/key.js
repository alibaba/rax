const { getAndRemoveAttr } = require('../helpers');

const type = global.TRANSPILER_TYPE || 'ali';
const ATTR_KEY_ALI = 'a:key';
const ATTR_KEY_WX = 'wx:key';

function transformNode(el, state) {
  if (type === 'ali' && el.attrsMap[ATTR_KEY_ALI] !== undefined) {
    el.key = getAndRemoveAttr(el, ATTR_KEY_ALI);
  } else if (type === 'wx' && el.attrsMap[ATTR_KEY_WX] !== undefined) {
    el.key = getAndRemoveAttr(el, ATTR_KEY_WX);
  }
}

module.exports = {
  transformNode
};
