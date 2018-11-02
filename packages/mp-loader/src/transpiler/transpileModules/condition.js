const ATTRIBUTES = {
  IF: 'a:if',
  ELSE_IF: 'a:elif',
  ELSE: 'a:else'
};

const { getAndRemoveAttr } = require('../helpers');

function transformNode(el, options) {
  const { attrsMap, attrsList } = el || {};
  if (!Array.isArray(attrsList)) {
    return;
  }

  const exp = getAndRemoveAttr(el, ATTRIBUTES.IF);
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, ATTRIBUTES.ELSE) != null) {
      el.else = true;
    }
    const elseif = getAndRemoveAttr(el, ATTRIBUTES.ELSE_IF);
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function addIfCondition(el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

module.exports = {
  transformNode
};
