const { getAndRemoveAttr } = require('../helpers');

const { getAdapter } = require('../adapter');

const adapter = getAdapter();

function transformNode(el, options) {
  const { attrsMap, attrsList } = el || {};
  const { IF_ATTRIBUTES } = adapter;
  if (!Array.isArray(attrsList)) {
    return;
  }

  const exp = getAndRemoveAttr(el, IF_ATTRIBUTES.IF);
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, IF_ATTRIBUTES.ELSE) != null) {
      el.else = true;
    }
    const elseif = getAndRemoveAttr(el, IF_ATTRIBUTES.ELSE_IF);
    if (elseif) {
      el.elseif = elseif;
    }
  }
};

function addIfCondition(el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

module.exports = {
  transformNode
};
